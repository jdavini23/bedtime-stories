import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  AuthProvider,
} from "firebase/auth";
import { getFirebaseInstance } from "@/lib/firebase/config";

// Authentication Providers
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

// Scopes and Permissions
googleProvider.addScope("profile");
googleProvider.addScope("email");
githubProvider.addScope("user:email");

// Get auth instance from Firebase configuration
let auth: any;
let authInitialized = false;
let authInitPromise: Promise<any> | null = null;

// Initialize auth instance
async function initAuth() {
  if (authInitialized) return auth;
  if (authInitPromise) return authInitPromise;

  authInitPromise = getFirebaseInstance()
    .then((instance) => {
      // Ensure we're using the same auth instance
      if (instance && instance.app) {
        auth = getAuth(instance.app);
      } else {
        throw new Error("Firebase instance or app is null");
      }
      authInitialized = true;
      return auth;
    })
    .catch((error) => {
      console.error("Failed to initialize Firebase Auth:", error);
      authInitPromise = null;
      throw error;
    });

  return authInitPromise;
}

// Ensure auth is initialized before any auth operation
async function ensureAuth() {
  if (!auth || !authInitialized) {
    await initAuth();
  }
  return auth;
}

// Social Login Method
export async function socialLogin(provider: AuthProvider) {
  try {
    const auth = await ensureAuth();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    return {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      providerData: user.providerData,
    };
  } catch (error) {
    console.error("Social login error:", error);
    throw error;
  }
}

// Google Sign-In
export async function signInWithGoogle() {
  return socialLogin(googleProvider);
}

// GitHub Sign-In
export async function signInWithGithub() {
  return socialLogin(githubProvider);
}

// Sign Out
export async function signOutUser() {
  try {
    const auth = await ensureAuth();
    await signOut(auth);
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
}

// User State Observer
export async function onAuthStateChange(callback: (user: User | null) => void) {
  try {
    const auth = await ensureAuth();
    return onAuthStateChanged(auth, (user) => {
      try {
        callback(user);
      } catch (error) {
        console.error("Error in auth state change callback:", error);
      }
    });
  } catch (error) {
    console.error("Error setting up auth state observer:", error);
    throw error;
  }
}

// Get Current User
export async function getCurrentUser(): Promise<User | null> {
  try {
    const auth = await ensureAuth();
    return auth.currentUser;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

// Token Management
export async function getIdToken(): Promise<string | null> {
  try {
    const user = await getCurrentUser();
    if (!user) return null;
    return await user.getIdToken();
  } catch (error) {
    console.error("Error getting ID token:", error);
    return null;
  }
}
