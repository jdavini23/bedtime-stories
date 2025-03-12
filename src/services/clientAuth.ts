'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
}

export const useClientAuth = () => {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        setCurrentUser(null);
        setUserId(null);
        return;
      }

      setCurrentUser({
        id: user.id,
        email: user.email || null,
        name: user.user_metadata?.full_name || null,
        image: user.user_metadata?.avatar_url || null,
      });
      setUserId(user.id);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email || null,
          name: session.user.user_metadata?.full_name || null,
          image: session.user.user_metadata?.avatar_url || null,
        });
        setUserId(session.user.id);
      } else {
        setCurrentUser(null);
        setUserId(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const getToken = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  };

  return {
    currentUser,
    getToken,
    userId,
  };
};
