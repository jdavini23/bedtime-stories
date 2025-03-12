'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/providers/SupabaseProvider';
import { Button } from '@/components/ui/button';

interface SignOutButtonProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
}

export function SignOutButton({ children, variant = 'ghost' }: SignOutButtonProps) {
  const router = useRouter();
  const { supabase } = useSupabase();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
      setIsLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <Button variant={variant} onClick={handleSignOut} disabled={isLoading}>
      {isLoading ? 'Signing out...' : children || 'Sign Out'}
    </Button>
  );
}
