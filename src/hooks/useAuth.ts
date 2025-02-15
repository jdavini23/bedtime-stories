import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  onAuthStateChange, 
  signInWithGoogle, 
  signInWithGithub, 
  signOutUser 
} from '@/lib/firebaseAuth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithGoogle();
      return result;
    } catch (error) {
      console.error('Google Login Error', error);
      throw error;
    }
  };

  const loginWithGithub = async () => {
    try {
      const result = await signInWithGithub();
      return result;
    } catch (error) {
      console.error('GitHub Login Error', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Logout Error', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    loginWithGoogle,
    loginWithGithub,
    logout
  };
}
