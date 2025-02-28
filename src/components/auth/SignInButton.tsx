'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@clerk/nextjs';

interface SignInButtonProps {
  redirectUrl?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export function SignInButton({
  redirectUrl = '/sign-in',
  className = '',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children = 'Sign In',
}: SignInButtonProps) {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  // Don't render the button if the user is already signed in
  if (isSignedIn) {
    return null;
  }

  const handleSignIn = () => {
    router.push(redirectUrl);
  };

  return (
    <Button
      variant={variant as any}
      size={size as any}
      fullWidth={fullWidth}
      className={className}
      onClick={handleSignIn}
      data-testid="sign-in-button"
    >
      {children}
    </Button>
  );
}
