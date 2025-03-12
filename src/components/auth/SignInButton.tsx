'use client';

import { useRouter } from 'next/navigation';
import { useSupabase } from '@/providers/SupabaseProvider';
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

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Error signing in:', error.message);
    }
  };

  return (
    <Button onClick={handleSignIn} variant={variant}>
      {children || `Sign in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`}
    </Button>
  );
}
