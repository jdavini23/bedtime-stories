import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { SupabaseUserService } from '@/services/supabaseUserService';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Get the webhook secret from environment variables
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('Missing CLERK_WEBHOOK_SECRET');
    return new NextResponse('Webhook secret not configured', { status: 500 });
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse('Missing svix headers', { status: 400 });
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
    console.error('Error verifying webhook:', err);
    return new NextResponse('Error verifying webhook', { status: 400 });
  }

  // Get the event type
  const eventType = evt.type;
  const userService = new SupabaseUserService();

  try {
    // Handle the different event types
    switch (eventType) {
      case 'user.created':
        await handleUserCreated(evt.data, userService);
        break;
      case 'user.updated':
        await handleUserUpdated(evt.data, userService);
        break;
      case 'user.deleted':
        await handleUserDeleted(evt.data, userService);
        break;
      default:
        // Ignore other event types
        console.log(`Unhandled webhook event type: ${eventType}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error processing webhook ${eventType}:`, error);
    return new NextResponse(
      `Error processing webhook: ${error instanceof Error ? error.message : 'Unknown error'}`,
      {
        status: 500,
      }
    );
  }
}

async function handleUserCreated(userData: any, userService: SupabaseUserService) {
  console.log('Processing user.created webhook');

  // Extract relevant user data
  const {
    id,
    email_addresses,
    first_name,
    last_name,
    image_url,
    public_metadata,
    private_metadata,
  } = userData;

  if (!id || !email_addresses || !email_addresses[0]) {
    throw new Error('Missing required user data in webhook payload');
  }

  const primaryEmail = email_addresses[0].email_address;

  // Create user in Supabase
  await userService.createUser({
    auth_id: id,
    email: primaryEmail,
    first_name: first_name || '',
    last_name: last_name || '',
    avatar_url: image_url || '',
  });

  // Sync metadata if available
  if (public_metadata || private_metadata) {
    await userService.syncUserMetadata(id, {
      public_metadata,
      private_metadata,
    });
  }
}

async function handleUserUpdated(userData: any, userService: SupabaseUserService) {
  console.log('Processing user.updated webhook');

  const {
    id,
    email_addresses,
    first_name,
    last_name,
    image_url,
    public_metadata,
    private_metadata,
  } = userData;

  if (!id) {
    throw new Error('Missing user ID in webhook payload');
  }

  // Check if user exists
  const existingUser = await userService.getUserByAuthId(id);

  if (!existingUser) {
    console.log(`User ${id} not found in Supabase, creating new record`);
    return handleUserCreated(userData, userService);
  }

  // Update user data
  const updateData: any = {};

  if (email_addresses && email_addresses[0]) {
    updateData.email = email_addresses[0].email_address;
  }

  if (first_name !== undefined) updateData.first_name = first_name;
  if (last_name !== undefined) updateData.last_name = last_name;
  if (image_url !== undefined) updateData.avatar_url = image_url;

  if (Object.keys(updateData).length > 0) {
    await userService.updateUser(id, updateData);
  }

  // Sync metadata if available
  if (public_metadata || private_metadata) {
    await userService.syncUserMetadata(id, {
      public_metadata,
      private_metadata,
    });
  }
}

async function handleUserDeleted(userData: any, userService: SupabaseUserService) {
  console.log('Processing user.deleted webhook');

  const { id } = userData;

  if (!id) {
    throw new Error('Missing user ID in webhook payload');
  }

  // Delete user from Supabase
  await userService.deleteUser(id);
}
