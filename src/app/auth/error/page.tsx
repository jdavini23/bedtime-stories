'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

import { Button } from '@/components/common/Button';

// Comprehensive error mapping for different authentication scenarios
const ERROR_MESSAGES = {
  OAuthSignin: {
    title: 'Authentication Failed',
    description: 'There was an issue signing in with the selected provider.',
    icon: LucideIcons.AlertTriangle,
    actions: [
      { label: 'Try Again', variant: 'primary' as const },
      { label: 'Back to Login', variant: 'secondary' as const }
    ]
  },
  OAuthCallback: {
    title: 'Callback Error',
    description: 'The authentication callback encountered an unexpected issue.',
    icon: LucideIcons.Network,
    actions: [
      { label: 'Retry Login', variant: 'primary' as const },
      { label: 'Contact Support', variant: 'secondary' as const }
    ]
  },
  OAuthCreateAccount: {
    title: 'Account Creation Failed',
    description: 'Unable to create an account with the selected provider.',
    icon: LucideIcons.ShieldOff,
    actions: [
      { label: 'Try Different Provider', variant: 'primary' as const },
      { label: 'Back to Login', variant: 'secondary' as const }
    ]
  },
  Unauthorized: {
    title: 'Access Denied',
    description: 'You are not authorized to access this resource.',
    icon: LucideIcons.Lock,
    actions: [
      { label: 'Return to Login', variant: 'primary' as const },
      { label: 'Contact Support', variant: 'secondary' as const }
    ]
  },
  Default: {
    title: 'Authentication Error',
    description: 'An unexpected error occurred during authentication.',
    icon: LucideIcons.AlertTriangle,
    actions: [
      { label: 'Retry', variant: 'primary' as const },
      { label: 'Back to Home', variant: 'secondary' as const }
    ]
  }
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
  const errorType = searchParams.get('error') || 'Default';
  const errorConfig = ERROR_MESSAGES[errorType as keyof typeof ERROR_MESSAGES] || ERROR_MESSAGES.Default;
  const ErrorIcon = errorConfig.icon;
  const errorMessage = getErrorMessage(errorType);

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
            <ErrorIcon 
              className="h-6 w-6 text-red-600" 
              strokeWidth={1.5} 
            />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {errorConfig.title}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {errorMessage}
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          {errorConfig.actions.map((action, index) => (
            <Button
              key={action.label}
              onClick={() => {
                switch (action.label) {
                  case 'Try Again':
                  case 'Retry Login':
                  case 'Retry':
                    router.push('/auth/signin');
                    break;
                  case 'Back to Login':
                  case 'Return to Login':
                    router.push('/auth/signin');
                    break;
                  case 'Back to Home':
                    router.push('/');
                    break;
                  case 'Contact Support':
                    router.push('/support');
                    break;
                  case 'Try Different Provider':
                    router.push('/auth/signin');
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


