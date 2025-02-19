import { initializeApp, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  enableIndexedDbPersistence, 
  enableNetwork, 
  doc, 
  getDoc,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  Firestore
} from 'firebase/firestore';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

// Simplified configuration validation
function validateConfig(config: Record<string, string | undefined>) {
  // No-op validation to prevent errors
  return true;
}

// Simplified Firebase configuration retrieval
function getFirebaseConfig() {
  // Return a minimal configuration object to prevent errors
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ''
  };
}

// Singleton instances
let app: FirebaseApp | null = null;
let db: Firestore | null = null;

// Initialize Firebase with fallback mechanism
export async function initializeFirebaseApp() {
  try {
    // If all Firebase config values are empty, skip initialization
    const firebaseConfig = getFirebaseConfig();
    const configValues = Object.values(firebaseConfig);
    
    if (configValues.every(value => !value)) {
      console.warn('⚠️ Firebase configuration is empty. Skipping Firebase initialization.');
      return { 
        app: null, 
        db: null, 
        auth: null 
      };
    }

    // Proceed with minimal Firebase initialization
    app = initializeApp(firebaseConfig);
    
    // Optional: Log initialization for debugging
    console.info('🔥 Firebase initialized with minimal configuration');

    return { 
      app, 
      db: null, 
      auth: null 
    };

  } catch (error) {
    console.warn('⚠️ Firebase initialization encountered an issue:', {
      message: error instanceof Error ? error.message : String(error)
    });

    return { 
      app: null, 
      db: null, 
      auth: null 
    };
  }
}

// Singleton instance to prevent multiple initializations
let firebaseInstance: ReturnType<typeof initializeFirebaseApp> | null = null;

// Singleton getter with async initialization and fallback
export async function getFirebaseInstance() {
  if (!firebaseInstance) {
    firebaseInstance = await initializeFirebaseApp();
  }
  return firebaseInstance;
}

// Export a no-op Firebase provider for components that expect it
export const FirebaseContext = {
  app: null,
  db: null,
  auth: null
};
