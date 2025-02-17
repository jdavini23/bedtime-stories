import { auth } from './firebase';
import { 
  signInWithGoogle, 
  signInWithGithub, 
  signOutUser, 
  getCurrentUser,
  getIdToken
} from './firebaseAuth';

export const authConfig = {
  providers: [
    {
      id: 'google',
      name: 'Google',
      type: 'oauth',
      signIn: signInWithGoogle,
    },
    {
      id: 'github',
      name: 'GitHub',
      type: 'oauth',
      signIn: signInWithGithub,
    }
  ],
  signOut: signOutUser,
  getCurrentUser,
  getIdToken,
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};


