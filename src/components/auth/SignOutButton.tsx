'use client';

import { useRouter } from 'next/navigation';
import { useSupabase } from '@/providers/SupabaseProvider';
import { Button } from '@/components/ui/button';

export function SignOutButton() {
  const router = useRouter();
  const { supabase } = useSupabase();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <Button variant="ghost" onClick={handleSignOut}>
      Sign Out
    </Button>
  );
}
