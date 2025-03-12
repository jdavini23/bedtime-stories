import { AuthError } from '@supabase/supabase-js';

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

export function handleAuthError(error: unknown): string {
  if (error instanceof AuthError) {
    switch (error.status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Authentication failed. Please sign in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'Resource not found.';
      case 422:
        return 'Invalid credentials. Please check your email and password.';
      case 429:
        return 'Too many requests. Please try again later.';
      default:
        return 'An authentication error occurred. Please try again.';
    }
  }

  if (error instanceof Error) {
    // Handle network errors or other generic errors
    if (error.message.includes('network')) {
      return 'Network error. Please check your connection and try again.';
    }
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
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
