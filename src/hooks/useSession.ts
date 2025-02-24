'use client';

import { useState, useEffect } from 'react';

// Mock session data for development
const mockSession = {
  user: {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
  },
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24 hours from now
};

export function useSession() {
  const [session, setSession] = useState(mockSession);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // In a real app, you would fetch the session from an API or auth provider
  useEffect(() => {
    // This is just a mock implementation
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSession(mockSession);
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 500);
  }, []);

  return {
    session,
    isAuthenticated,
    isLoading,
  };
}
