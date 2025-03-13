'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';

interface SignInButtonProps {
  children?: React.ReactNode;
  provider?: 'github' | 'google';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
}

export function SignInButton({
  children,
  provider = 'github',
  variant = 'primary',
}: SignInButtonProps) {
  const router = useRouter();
  const { supabase } = useSupabase();
  const { isSignedIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  if (isSignedIn) {
    return null;
  }

  const handleSignIn = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Error signing in:', error.message);
    }
    router.push('/');
    setIsLoading(false);
  };

  return (
    <Button onClick={handleSignIn} variant={variant} disabled={isLoading}>
      {isLoading
        ? 'Signing in...'
        : children || `Sign in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`}
    </Button>
  );
}
