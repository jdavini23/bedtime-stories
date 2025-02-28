import * as ClerkServer from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get auth state from Clerk
    const { userId, sessionId } = await ClerkServer.auth();

    // Try to get the full user object
    let user = null;
    let userError = null;

    try {
      user = await ClerkServer.currentUser();
    } catch (error) {
      userError = error instanceof Error ? error.message : String(error);
    }

    // Return the auth state
    return NextResponse.json({
      auth: {
        userId,
        sessionId,
        isAuthenticated: !!userId,
      },
      user: user
        ? {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.emailAddresses?.[0]?.emailAddress,
          }
        : null,
      userError,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Auth check error:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
