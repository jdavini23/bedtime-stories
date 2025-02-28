'use client';

import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface SignOutButtonProps {
  redirectUrl?: string;
  className?: string;
  variant?: 'primary' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export function SignOutButton({
  redirectUrl = '/',
  className = '',
  variant = 'outline',
  size = 'md',
  fullWidth = false,
  children = 'Sign Out',
}: SignOutButtonProps) {
  const { signOut } = useClerk();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut(() => {
        router.push(redirectUrl);
        router.refresh(); // Refresh to update auth state throughout the app
      });
    } catch (error) {
      console.error('Error signing out:', error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleSignOut}
      disabled={isLoading}
      fullWidth={fullWidth}
    >
      {isLoading ? 'Signing out...' : children}
    </Button>
  );
}
