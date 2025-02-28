'use client';

import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  fallback?: React.ReactNode;
}

/**
 * A component that protects routes requiring authentication
 * Use this for client components that need authentication
 */
export function ProtectedRoute({
  children,
  adminOnly = false,
  fallback = <div className="p-4 text-center">Loading authentication...</div>,
}: ProtectedRouteProps) {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after auth has loaded
    if (isLoaded) {
      // Redirect if not signed in
      if (!isSignedIn) {
        router.push(`/sign-in?redirect_url=${encodeURIComponent(window.location.pathname)}`);
        return;
      }

      // Redirect if admin-only and user is not admin
      if (adminOnly && user && !user.isAdmin) {
        router.push('/dashboard');
        return;
      }
    }
  }, [isLoaded, isSignedIn, user, adminOnly, router]);

  // Show fallback while loading or if not authenticated
  if (!isLoaded || !isSignedIn || (adminOnly && user && !user.isAdmin)) {
    return <>{fallback}</>;
  }

  // User is authenticated and authorized, render children
  return <>{children}</>;
}

/**
 * A component that protects routes requiring admin privileges
 */
export function AdminRoute({
  children,
  fallback = <div className="p-4 text-center">This page requires administrator privileges.</div>,
}: Omit<ProtectedRouteProps, 'adminOnly'>) {
  return (
    <ProtectedRoute adminOnly={true} fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}
