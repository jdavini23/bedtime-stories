import { useEffect, useCallback, useRef } from 'react';
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
  const lastSignInRef = useRef<Date | null>(null);

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

  // Monitor for authentication state changes
  useEffect(() => {
    if (!isLoaded || !user) return;

    const currentSignInTime = user.lastSignInAt;
    const lastSignInTime = lastSignInRef.current;

    // Check if there's a new sign-in
    if (currentSignInTime && (!lastSignInTime || currentSignInTime > lastSignInTime)) {
      lastSignInRef.current = currentSignInTime;
      logSecurityEvent({
        type: 'info',
        message: 'User authentication state changed',
        details: {
          userId: user.id,
          lastSignInAt: currentSignInTime.toISOString(),
          isSignedIn,
        },
      });
    }
  }, [isLoaded, user, isSignedIn, logSecurityEvent]);

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
