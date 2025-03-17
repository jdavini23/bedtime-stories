'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });

    if (process.env.NODE_ENV !== 'production') {
      console.error('[ErrorBoundary] Caught error:', error);
      console.error('[ErrorBoundary] Error info:', errorInfo);
    }
  }

  private getErrorMessage(): string {
    const { error } = this.state;

    if (!error) return 'An unknown error occurred';

    // Handle specific Placeholder component errors
    if (error.message.includes('Invalid dimensions')) {
      return 'Invalid placeholder dimensions provided. Width and height must be positive numbers.';
    }

    // Handle other specific error cases here
    if (error.message.includes('Maximum update depth exceeded')) {
      return 'A rendering loop was detected. This is likely a bug in the component.';
    }

    return error.message;
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{this.getErrorMessage()}</p>
            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <pre className="mt-2 text-sm text-red-500 dark:text-red-300 overflow-auto">
                {this.state.error.stack}
              </pre>
            )}
          </div>
        )
      );
    }

    return this.props.children;
  }
}
