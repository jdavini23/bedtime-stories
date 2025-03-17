'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSupabase } from '@/providers/SupabaseAuthProvider';
import ResetPassword from '@/components/auth/ResetPassword';

export default function ResetPasswordPage() {
  const { user } = useSupabase();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // If user is already logged in and not in a password reset flow,
    // redirect them to the dashboard
    if (user && !searchParams?.has('code')) {
      const redirectUrl = searchParams?.get('redirect_url');
      router.push(redirectUrl || '/dashboard');
    }
  }, [user, router, searchParams]);

  return <ResetPassword />;
}
