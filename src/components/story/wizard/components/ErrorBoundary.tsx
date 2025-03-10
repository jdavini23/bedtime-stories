'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/common/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100">
          <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
          <p className="mb-4 text-sm text-red-800 dark:text-red-200">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <Button onClick={this.handleRetry} variant="danger" className="text-sm">
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
