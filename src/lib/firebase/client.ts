import { initializeApp, getApp, getApps } from 'firebase/app';
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  connectFirestoreEmulator,
  enableIndexedDbPersistence,
  disableNetwork,
  enableNetwork,
  type Firestore
} from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with advanced persistence settings
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

// Initialize Auth
const auth = getAuth(app);

// Enhanced offline persistence setup
async function setupOfflinePersistence(firestoreInstance: Firestore): Promise<boolean> {
  try {
    await enableIndexedDbPersistence(firestoreInstance, { 
      forceOwnership: false 
    });
    console.log('Offline persistence enabled successfully');
    return true;
  } catch (error) {
    const firestoreError = error as { code?: string };
    switch (firestoreError.code) {
      case 'failed-precondition':
        console.warn('Offline persistence can only be enabled in one tab at a time.');
        break;
      case 'unimplemented':
        console.warn('Browser does not support offline persistence.');
        break;
      default:
        console.error('Error enabling offline persistence:', error);
    }
    return false;
  }
}

// Network connection management
async function manageNetworkConnection(firestoreInstance: Firestore) {
  try {
    // Check initial network status
    const isOnline = navigator.onLine;

    // Add event listeners for online/offline events
    window.addEventListener('online', () => {
      console.log('Network connection restored. Enabling Firestore network.');
      enableNetwork(firestoreInstance);
    });

    window.addEventListener('offline', () => {
      console.log('Network connection lost. Disabling Firestore network.');
      disableNetwork(firestoreInstance);
    });

    // Initially disable network if offline
    if (!isOnline) {
      await disableNetwork(firestoreInstance);
    }
  } catch (error) {
    console.error('Error managing network connection:', error);
  }
}

// Connect to emulators in development
function connectToEmulators() {
  if (process.env.NODE_ENV === 'development') {
    try {
      if (window.location.hostname === 'localhost') {
        connectFirestoreEmulator(db, 'localhost', 8080);
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
        console.log('Connected to Firebase emulators');
      }
    } catch (error) {
      console.warn('Error connecting to Firebase emulators:', error);
    }
  }
}

// Initialize persistence and network management
setupOfflinePersistence(db);
manageNetworkConnection(db);
connectToEmulators();

/**
 * Safely execute a Firebase operation with comprehensive error handling
 * @param operation The Firebase operation to execute
 * @param fallbackValue Optional fallback value if the operation fails
 * @param retryCount Number of retry attempts
 */
export async function safeFirebaseOperation<T>(
  operation: () => Promise<T>, 
  fallbackValue?: T,
  retryCount: number = 3
): Promise<T | undefined> {
  for (let attempt = 1; attempt <= retryCount; attempt++) {
    try {
      // Check network status before attempting operation
      if (!navigator.onLine) {
        console.warn(`Offline: Skipping Firebase operation (Attempt ${attempt})`);
        return fallbackValue;
      }

      return await operation();
    } catch (error) {
      const firestoreError = error as { code?: string, message?: string };
      
      console.error(`Firebase operation failed (Attempt ${attempt}):`, {
        code: firestoreError.code,
        message: firestoreError.message
      });

      // Handle specific offline/network errors
      if (
        firestoreError.code === 'unavailable' || 
        firestoreError.code === 'failed-precondition'
      ) {
        console.warn('Operating in offline mode');
        
        // If it's the last attempt, return fallback
        if (attempt === retryCount) {
          return fallbackValue;
        }

        // Wait before retrying with exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      } else {
        // For non-network errors, stop retrying
        return fallbackValue;
      }
    }
  }

  return fallbackValue;
}

export { db, auth };
