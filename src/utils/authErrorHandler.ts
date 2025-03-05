import { AuthError } from '@clerk/nextjs';
import { logSecurityEvent } from '@/middleware/securityMonitoring';

export class AuthenticationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 401
  ) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export function handleAuthError(error: unknown): AuthenticationError {
  if (error instanceof AuthError) {
    const message = getAuthErrorMessage(error);
    const code = error.code || 'unknown_auth_error';
    
    logSecurityEvent('error', 'Authentication error occurred', {
      code,
      message,
      type: error.name,
    });

    return new AuthenticationError(message, code);
  }

  if (error instanceof Error) {
    logSecurityEvent('error', 'Unexpected authentication error', {
      message: error.message,
      type: error.name,
    });

    return new AuthenticationError(
      'An unexpected authentication error occurred',
      'unexpected_auth_error'
    );
  }

  logSecurityEvent('error', 'Unknown authentication error', {
    error: String(error),
  });

  return new AuthenticationError(
    'An unknown authentication error occurred',
    'unknown_error'
  );
}

function getAuthErrorMessage(error: AuthError): string {
  switch (error.code) {
    case 'session_expired':
      return 'Your session has expired. Please sign in again.';
    case 'invalid_token':
      return 'Invalid authentication token. Please sign in again.';
    case 'unauthorized':
      return 'You are not authorized to access this resource.';
    case 'network_error':
      return 'Network error occurred. Please check your connection and try again.';
    case 'rate_limited':
      return 'Too many authentication attempts. Please try again later.';
    default:
      return error.message || 'An authentication error occurred.';
  }
}
