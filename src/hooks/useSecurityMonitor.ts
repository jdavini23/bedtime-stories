'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

interface SecurityEvent {
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
}

export function useSecurityMonitor() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (!error && session) {
        setIsAdmin(session.user.user_metadata.role === 'admin');
      }
    };

    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    // Fetch security events from your API
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/security/events');
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        }
      } catch (error) {
        console.error('Failed to fetch security events:', error);
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, [isAdmin]);

  return {
    events,
    isAdmin,
  };
}
