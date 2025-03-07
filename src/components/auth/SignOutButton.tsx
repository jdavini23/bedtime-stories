'use client';

import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/common/Button';

interface SignOutButtonProps {
  redirectUrl?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
  fullwidth?: boolean;
}

const SignOutButton: React.FC<SignOutButtonProps> = ({
  redirectUrl = '/',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  fullwidth,
}) => {
  const { signOut } = useClerk();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
      router.push(redirectUrl);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSignOut}
      variant={variant}
      size={size}
      className={className}
      fullwidth={fullwidth}
      disabled={isLoading}
    >
      {children || 'Sign Out'}
    </Button>
  );
};

export { SignOutButton };
export default SignOutButton;
