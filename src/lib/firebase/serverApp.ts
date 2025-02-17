import 'dotenv/config';
import admin from 'firebase-admin';

// Type-safe environment variable validation
function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Prevent multiple initializations
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: getEnvVar('FIREBASE_PROJECT_ID'),
      clientEmail: getEnvVar('FIREBASE_CLIENT_EMAIL'),
      privateKey: getEnvVar('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n')
    })
  });
}

export const firebaseAdminApp = admin.app();
export const firestore = admin.firestore();
export const auth = admin.auth();
