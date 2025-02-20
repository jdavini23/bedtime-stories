import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { logger } from '@/utils/loggerInstance';

// Centralized development authentication logging
export function devLog(message: string, context?: Record<string, any>) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [DevAuth] ${message}`;

  logger.info(logEntry);

  if (context) {
    logger.info(JSON.stringify(context, null, 2));
  }

  // Optional file logging with minimal complexity
  try {
    const fs = require('fs');
    const path = require('path');
    const logPath = path.resolve(process.cwd(), 'dev-auth.log');

    fs.appendFileSync(
      logPath,
      `${logEntry}\n${context ? JSON.stringify(context, null, 2) + '\n' : ''}\n`
    );
  } catch {
    // Silently handle logging errors
  }
}

// Unified development authentication strategy
export function getDevelopmentUserId(req: NextRequest): string {
  // Priority order for user ID determination
  const userIdSources = [
    () => req.headers.get('x-test-user-id'),
    () => req.headers.get('x-clerk-auth-user-id'),
    () => req.headers.get('x-dev-auth-override'),
    () => process.env.NEXT_PUBLIC_DEV_USER_ID,
    () => 'dev-default-user',
  ];

  for (const source of userIdSources) {
    const userId = source();
    if (userId) {
      devLog('User ID Source Identified', {
        userId,
        source: source.name,
      });
      return userId;
    }
  }

  // Fallback to default
  return 'dev-default-user';
}

// Development authentication context generator
export function createDevAuthContext(userId: string | null | null | null | null | null | null) {
  const authContext = {
    userId,
    sessionId: `dev-session-${userId}`,
    getToken: async () => `dev-token-${userId}`,
    claims: {
      source: 'development-auth',
    },
  };

  devLog('Development Authentication Context Created', authContext);
  return authContext;
}

// Main development authentication middleware
export function devAuthMiddleware(req: NextRequest) {
  // Only apply in development environment
  if (env.NODE_ENV !== 'development') {
    devLog('Not in development mode, skipping authentication');
    return null;
  }

  // Log request details for comprehensive debugging
  devLog('Development Authentication Request', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers),
  });

  // Determine user ID
  const userId = getDevelopmentUserId(req);

  // Create and return authentication context
  return createDevAuthContext(userId);
}

// Clerk authentication patch for development
export function patchClerkAuth() {
  if (env.NODE_ENV === 'development') {
    try {
      const clerkModule = require('@clerk/nextjs');

      clerkModule.auth = () => {
        const userId = process.env.NEXT_PUBLIC_DEV_USER_ID || 'dev-default-user';

        const patchedContext = createDevAuthContext(userId);

        devLog('Clerk Authentication Patched', {
          userId: patchedContext.userId,
        });

        return patchedContext;
      };

      devLog('Clerk Authentication Successfully Patched');
    } catch (error) {
      devLog('Clerk Authentication Patch Failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

// Optional middleware for additional development authentication injection
export function devAuthInjectionMiddleware(req: NextRequest) {
  devLog('Development Authentication Injection Middleware', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers),
  });
  return new NextResponse(null, { status: 200 });
}
