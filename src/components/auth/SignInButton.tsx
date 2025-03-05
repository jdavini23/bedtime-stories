'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@clerk/nextjs';

interface SignInButtonProps {
  fallbackRedirectUrl?: string;
  forceRedirectUrl?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export function SignInButton({
  fallbackRedirectUrl = '/dashboard',
  forceRedirectUrl,
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
    // Use forceRedirectUrl if provided, otherwise fallback to fallbackRedirectUrl
    const redirectUrl = forceRedirectUrl || fallbackRedirectUrl;
    router.push(`/sign-in?redirect_url=${encodeURIComponent(redirectUrl)}`);
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
