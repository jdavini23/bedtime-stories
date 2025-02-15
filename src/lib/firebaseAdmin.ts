import admin from 'firebase-admin';
import { cert } from 'firebase-admin/app';

// Prevent multiple initializations
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      }),
      // Optional: Add other Firebase service configurations
    });
  } catch (error) {
    console.error('Firebase Admin initialization error', error);
  }
}

export const firebaseAdmin = admin;
