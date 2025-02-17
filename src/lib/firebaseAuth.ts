import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User,
  AuthProvider
} from 'firebase/auth';
import { auth } from './firebase';

// Authentication Providers
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

// Scopes and Permissions
googleProvider.addScope('profile');
googleProvider.addScope('email');
githubProvider.addScope('user:email');

// Social Login Method
export async function socialLogin(provider: AuthProvider) {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    return {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      providerData: user.providerData
    };
  } catch (error: any) {
    console.error('Social Login Error', error);
    throw new Error(error.message);
  }
}

// Google Sign-In
export const signInWithGoogle = () => socialLogin(googleProvider);

// GitHub Sign-In
export const signInWithGithub = () => socialLogin(githubProvider);

// Sign Out
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign Out Error', error);
  }
};

// User State Observer
export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Get Current User
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

// Token Management
export async function getIdToken(): Promise<string | null> {
  const user = getCurrentUser();
  return user ? await user.getIdToken() : null;
}


