'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/Button';
import { useAuth } from '@clerk/nextjs';

interface SignInButtonProps {
  redirectUrl?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
  fullwidth?: boolean;
}

const SignInButton: React.FC<SignInButtonProps> = ({
  redirectUrl = '/sign-in',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  fullwidth,
}) => {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  // Don't render the button if the user is already signed in
  if (isSignedIn) {
    return null;
  }

  const handleSignIn = () => {
    router.push(`${redirectUrl}?redirect_url=${encodeURIComponent(redirectUrl)}`);
  };

  return (
    <Button
      variant={variant}
      size={size}
      fullwidth={fullwidth}
      className={className}
      onClick={handleSignIn}
      data-testid="sign-in-button"
    >
      {children || 'Sign In'}
    </Button>
  );
};

export { SignInButton };
export default SignInButton;
