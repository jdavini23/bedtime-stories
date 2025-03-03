import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';
import { SupabaseUserService } from '@/services/supabaseUserService';
import { logger } from '@/utils/logger';
import { env } from '@/lib/env';

// Webhook handler for Clerk events
export async function POST(req: NextRequest) {
  // Verify the webhook signature
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    logger.error('Missing CLERK_WEBHOOK_SECRET');
    return NextResponse.json({ error: 'Missing webhook secret' }, { status: 500 });
  }

  // Get the headers
  const svix_id = req.headers.get('svix-id');
  const svix_timestamp = req.headers.get('svix-timestamp');
  const svix_signature = req.headers.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    logger.error('Missing Svix headers');
    return NextResponse.json({ error: 'Missing Svix headers' }, { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    logger.error('Error verifying webhook', { error: err });
    return NextResponse.json({ error: 'Error verifying webhook' }, { status: 400 });
  }

  // Get the event type
  const eventType = evt.type;
  logger.info('Webhook received', { eventType });

  // Handle the event
  try {
    switch (eventType) {
      case 'user.created': {
        const { id, email_addresses } = evt.data;
        const email = email_addresses?.[0]?.email_address;

        if (id && email) {
          await SupabaseUserService.createUser(id, email);
          logger.info('User created in Supabase', { id, email });
        } else {
          logger.warn('Missing user data in webhook', { id, email });
        }
        break;
      }

      case 'user.updated': {
        const { id, email_addresses } = evt.data;
        const email = email_addresses?.[0]?.email_address;

        if (id && email) {
          // Check if user exists, create if not
          const user = await SupabaseUserService.getUserByAuthId(id);
          if (!user) {
            await SupabaseUserService.createUser(id, email);
            logger.info('User created in Supabase on update', { id, email });
          }
          // Note: We could update more user data here if needed
        } else {
          logger.warn('Missing user data in webhook', { id, email });
        }
        break;
      }

      case 'user.deleted': {
        const { id } = evt.data;

        if (id) {
          await SupabaseUserService.deleteUser(id);
          logger.info('User deleted from Supabase', { id });
        } else {
          logger.warn('Missing user ID in webhook', { data: evt.data });
        }
        break;
      }

      default:
        // Unhandled event type
        logger.info('Unhandled webhook event type', { eventType });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error processing webhook', { error, eventType });

    if (env.NODE_ENV === 'development') {
      return NextResponse.json(
        { error: 'Error processing webhook', details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: 'Error processing webhook' }, { status: 500 });
  }
}
