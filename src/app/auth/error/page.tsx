'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { Button } from '@/components/common/Button';

// Simple SVG icon components to replace lucide-react
const AlertIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6 text-red-600"
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6 text-red-600"
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const ShieldIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6 text-red-600"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m14.5 9-5 5" />
    <path d="m9.5 9 5 5" />
  </svg>
);

const WifiIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6 text-red-600"
  >
    <path d="M5 13a10 10 0 0 1 14 0" />
    <path d="M8.5 16.5a5 5 0 0 1 7 0" />
    <path d="M2 8.82a15 15 0 0 1 20 0" />
    <line x1="12" x2="12.01" y1="20" y2="20" />
  </svg>
);

// Comprehensive error mapping for different authentication scenarios
const ERROR_MESSAGES = {
  OAuthSignin: {
    title: 'Authentication Failed',
    description: 'There was an issue signing in with the selected provider.',
    icon: AlertIcon,
    actions: [
      { label: 'Try Again', variant: 'primary' as const },
      { label: 'Back to Login', variant: 'secondary' as const },
    ],
  },
  OAuthCallback: {
    title: 'Callback Error',
    description: 'The authentication callback encountered an unexpected issue.',
    icon: WifiIcon,
    actions: [
      { label: 'Retry Login', variant: 'primary' as const },
      { label: 'Contact Support', variant: 'secondary' as const },
    ],
  },
  OAuthCreateAccount: {
    title: 'Account Creation Failed',
    description: 'Unable to create an account with the selected provider.',
    icon: ShieldIcon,
    actions: [
      { label: 'Try Different Provider', variant: 'primary' as const },
      { label: 'Back to Login', variant: 'secondary' as const },
    ],
  },
  Unauthorized: {
    title: 'Access Denied',
    description: 'You are not authorized to access this resource.',
    icon: LockIcon,
    actions: [
      { label: 'Return to Login', variant: 'primary' as const },
      { label: 'Contact Support', variant: 'secondary' as const },
    ],
  },
  Default: {
    title: 'Authentication Error',
    description: 'An unexpected error occurred during authentication.',
    icon: AlertIcon,
    actions: [
      { label: 'Retry', variant: 'primary' as const },
      { label: 'Back to Home', variant: 'secondary' as const },
    ],
  },
};

function isValidVariant(variant: string): variant is 'primary' | 'secondary' {
  return variant === 'primary' || variant === 'secondary';
}

const getErrorMessage = (error: string | null) => {
  switch (error) {
    case 'OAuthSignin':
      return 'Error signing in with your provider. Please try again.';
    case 'OAuthCallback':
      return 'Error receiving data from your provider. Please try again.';
    case 'OAuthCreateAccount':
      return 'Error creating your account. Please try again.';
    case 'EmailCreateAccount':
      return 'Error creating your account. Please try again.';
    case 'Callback':
      return 'Error during the authentication process. Please try again.';
    case 'OAuthAccountNotLinked':
      return 'This email is already associated with another account.';
    case 'EmailSignin':
      return 'Error sending the verification email. Please try again.';
    case 'CredentialsSignin':
      return 'Invalid credentials. Please check your email and password.';
    case 'SessionRequired':
      return 'Please sign in to access this page.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

export default function AuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorType = searchParams?.get('error') || 'Default';
  const errorConfig =
    ERROR_MESSAGES[errorType as keyof typeof ERROR_MESSAGES] || ERROR_MESSAGES.Default;
  const ErrorIcon = errorConfig.icon;
  const errorMessage = getErrorMessage(errorType);

  const handleRetry = () => {
    router.push('/sign-in');
  };

  const handleSignIn = () => {
    router.push('/sign-in');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl"
      >
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <ErrorIcon />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">{errorConfig.title}</h2>
          <p className="mt-2 text-sm text-gray-600">{errorMessage}</p>
        </div>

        <div className="mt-8 flex justify-center">
          {errorConfig.actions.map((action, _index) => (
            <Button
              key={action.label}
              onClick={() => {
                switch (action.label) {
                  case 'Try Again':
                  case 'Retry Login':
                  case 'Retry':
                    handleRetry();
                    break;
                  case 'Back to Login':
                  case 'Return to Login':
                    handleSignIn();
                    break;
                  case 'Back to Home':
                    router.push('/');
                    break;
                  case 'Contact Support':
                    router.push('/support');
                    break;
                  case 'Try Different Provider':
                    router.push('/sign-in');
                    break;
                }
              }}
              variant={isValidVariant(action.variant) ? action.variant : 'primary'}
              className="w-full"
            >
              {action.label}
            </Button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
