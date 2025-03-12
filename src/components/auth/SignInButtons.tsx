'use client';

import { createBrowserClient } from '@supabase/ssr';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

export function SignInButtons() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleGithubSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <Button variant="outline" onClick={handleGoogleSignIn} className="flex items-center gap-2">
        <FcGoogle className="h-5 w-5" />
        Sign in with Google
      </Button>
      <Button variant="outline" onClick={handleGithubSignIn} className="flex items-center gap-2">
        <FaGithub className="h-5 w-5" />
        Sign in with GitHub
      </Button>
    </div>
  );
}
