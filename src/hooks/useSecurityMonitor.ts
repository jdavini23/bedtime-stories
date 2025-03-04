import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

interface SecurityEvent {
  type: 'warning' | 'error' | 'info';
  message: string;
  details?: Record<string, unknown>;
}

export function useSecurityMonitor() {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();

  const logSecurityEvent = useCallback(async (event: SecurityEvent) => {
    try {
      await fetch('/api/security/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          userId: user?.id,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }, [user]);

  // Monitor for suspicious activity
  useEffect(() => {
    if (!isLoaded) return;

    // Monitor authentication state changes
    const unsubscribe = user?.subscribe((newUser) => {
      if (newUser?.lastSignInAt !== user?.lastSignInAt) {
        logSecurityEvent({
          type: 'info',
          message: 'User signed in',
          details: {
            userId: newUser?.id,
            lastSignInAt: newUser?.lastSignInAt,
          },
        });
      }
    });

    return () => {
      unsubscribe?.();
    };
  }, [isLoaded, user, logSecurityEvent]);

  // Monitor for session expiration
  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn && user === null) {
      logSecurityEvent({
        type: 'warning',
        message: 'Session expired or user signed out',
      });
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, user, router, logSecurityEvent]);

  return {
    logSecurityEvent,
  };
}
