'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { getFirebaseInstance, initializeFirebaseApp } from '@/lib/firebase/config';

// Define the shape of the Firebase context
interface FirebaseContextType {
  app: FirebaseApp | null;
  db: Firestore | null;
  auth: Auth | null;
  isInitialized: boolean;
  error: Error | null;
  isOnline: boolean;
}

// Create the context with a default value
const FirebaseContext = createContext<FirebaseContextType>({
  app: null,
  db: null,
  auth: null,
  isInitialized: false,
  error: null,
  isOnline: true
});

// Custom hook to use Firebase context
export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

// Firebase Provider component
export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [firebaseState, setFirebaseState] = useState<FirebaseContextType>({
    app: null,
    db: null,
    auth: null,
    isInitialized: false,
    error: null,
    isOnline: true
  });

  const initializeFirebase = async () => {
    try {
      const instance = await initializeFirebaseApp();
      
      // Use browser's native online status
      const isOnline = typeof window !== 'undefined' ? navigator.onLine : true;

      setFirebaseState({
        app: instance.app,
        db: instance.db,
        auth: instance.auth,
        isInitialized: true,
        error: null,
        isOnline: isOnline
      });

      // Monitor online/offline status
      const handleOnlineStatus = () => {
        setFirebaseState(prev => ({ ...prev, isOnline: true }));
      };

      const handleOfflineStatus = () => {
        setFirebaseState(prev => ({ ...prev, isOnline: false }));
      };

      // Only add event listeners if in browser environment
      if (typeof window !== 'undefined') {
        window.addEventListener('online', handleOnlineStatus);
        window.addEventListener('offline', handleOfflineStatus);

        return () => {
          window.removeEventListener('online', handleOnlineStatus);
          window.removeEventListener('offline', handleOfflineStatus);
        };
      }
    } catch (error) {
      console.error('Firebase initialization failed:', error);
      
      setFirebaseState(prev => ({
        ...prev,
        isInitialized: true,
        error: error instanceof Error 
          ? error 
          : new Error('Firebase initialization failed')
      }));
    }
  };

  useEffect(() => {
    if (!firebaseState.isInitialized) {
      initializeFirebase();
    }
  }, []);

  // Loading state
  if (!firebaseState.isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-gray-600">
          Initializing Firebase...
        </div>
      </div>
    );
  }

  // Error state
  if (firebaseState.error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <h2 className="text-lg font-semibold text-red-800">
          Firebase Configuration Error
        </h2>
        <p className="mt-2 text-sm text-red-600">
          {firebaseState.error.message}
        </p>
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-2 text-xs text-red-500">
            <p>Please check your .env.local file and ensure the following variables are set:</p>
            <ul className="list-disc list-inside">
              <li>NEXT_PUBLIC_FIREBASE_API_KEY</li>
              <li>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</li>
              <li>NEXT_PUBLIC_FIREBASE_PROJECT_ID</li>
            </ul>
            <p className="mt-1">You can find these values in your Firebase project settings.</p>
          </div>
        )}
      </div>
    );
  }

  // Offline state notification
  const offlineNotification = !firebaseState.isOnline && (
    <div className="fixed bottom-4 right-4 bg-yellow-50 border border-yellow-200 rounded-md p-4 shadow-lg">
      <p className="text-sm text-yellow-800">
        You are currently offline. Some features may be limited.
      </p>
    </div>
  );

  // Render children with Firebase context
  return (
    <FirebaseContext.Provider value={firebaseState}>
      {children}
      {offlineNotification}
    </FirebaseContext.Provider>
  );
}
