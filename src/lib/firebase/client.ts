import { initializeApp, getApp, getApps } from 'firebase/app';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  connectFirestoreEmulator,
  disableNetwork,
  enableNetwork,
  type Firestore,
  onSnapshot,
  doc,
  getFirestore,
  type FirestoreError
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
const db = getApps().length ? getFirestore(app) : initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

// Initialize Auth
const auth = getAuth(app);

// Enhanced error logging for Firestore connection attempts
async function checkNetworkConnection(firestoreInstance: Firestore) {
  try {
    // Use a dummy document to test connection
    const dummyDocRef = doc(firestoreInstance, '__connectivity__', 'check');
    
    return new Promise((resolve, reject) => {
      const unsubscribe = onSnapshot(
        dummyDocRef, 
        () => {
          console.log('Firestore connection successful');
          unsubscribe();
          resolve(true);
        },
        (error) => {
          console.warn('Firestore connection check failed:', error);
          unsubscribe();
          reject(error);
        }
      );
    });
  } catch (error) {
    console.error('Network connectivity check failed:', error);
    return false;
  }
}

async function attemptReconnection(firestoreInstance: Firestore) {
  let connectionAttempts = 0;
  const MAX_CONNECTION_ATTEMPTS = 5;
  const RETRY_DELAY_MS = 2000;

  const reconnect = async () => {
    if (connectionAttempts >= MAX_CONNECTION_ATTEMPTS) {
      console.error('Max connection attempts reached. Switching to offline mode.');
      await disableNetwork(firestoreInstance);
      return;
    }

    connectionAttempts++;
    console.log(`Connection attempt ${connectionAttempts}`);

    try {
      await enableNetwork(firestoreInstance);
      const isConnected = await checkNetworkConnection(firestoreInstance);
      
      if (!isConnected) {
        console.warn('Network connection unstable. Retrying...');
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * connectionAttempts));
        await reconnect();
      } else {
        connectionAttempts = 0; // Reset attempts on successful connection
      }
    } catch (error) {
      console.warn('Reconnection attempt failed:', error);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * connectionAttempts));
      await reconnect();
    }
  };

  // Initial connection check
  reconnect();
}

// Monitor network connectivity and handle online/offline events
function monitorNetworkConnectivity(firestoreInstance: Firestore) {
  window.addEventListener('online', async () => {
    console.log('Network connection restored. Attempting to reconnect...');
    await attemptReconnection(firestoreInstance);
  });

  window.addEventListener('offline', async () => {
    console.warn('Network connection lost. Disabling Firestore network.');
    await disableNetwork(firestoreInstance);
  });
}

// Connect to emulators in development
function connectToEmulators() {
  if (process.env.NODE_ENV === 'development') {
    try {
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        connectFirestoreEmulator(db, 'localhost', 8080);
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
        console.log('Connected to Firebase emulators');
      }
    } catch (error) {
      console.warn('Error connecting to Firebase emulators:', error);
    }
  }
}

// Enhanced error logging for Firebase operations
export async function safeFirebaseOperation<T>(
  operation: () => Promise<T>, 
  fallbackValue?: T,
  retryCount: number = 3
): Promise<T | undefined> {
  for (let attempt = 1; attempt <= retryCount; attempt++) {
    try {
      if (!navigator.onLine) {
        console.warn(`Offline: Skipping Firebase operation (Attempt ${attempt})`);
        return fallbackValue;
      }

      return await operation();
    } catch (error: unknown) {
      // Ensure error is an instance of Error for proper logging
      const firestoreError = error instanceof Error ? error : new Error('Unknown error');
      
      console.error(`Firebase operation failed (Attempt ${attempt}):`, {
        code: (firestoreError as { code?: string }).code || 'No code',
        message: firestoreError.message,
        stack: firestoreError.stack || 'No stack trace available',
        context: {
          attempt,
          operation: operation.toString(),
        }
      });

      if (
        typeof (firestoreError as FirestoreError).code === 'string' &&
        (
          (firestoreError as any).code === 'unavailable' || 
          (firestoreError as any).code === 'failed-precondition' ||
          (firestoreError as any).code === 'deadline-exceeded'
        )
      ) {
        console.warn('Operating in offline or degraded mode');
        
        if (attempt === retryCount) {
          return fallbackValue;
        }

        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      } else {
        return fallbackValue;
      }
    }
  }

  return fallbackValue;
}

// Initialize configuration
monitorNetworkConnectivity(db);
connectToEmulators();

export { db, auth };
