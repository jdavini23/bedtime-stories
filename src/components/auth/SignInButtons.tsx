import { useSignIn } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';

export function SignInButtons() {
  const { signIn, isLoaded } = useSignIn();

  if (!isLoaded) {
    return null;
  }

  const signInWithGoogle = async () => {
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/dashboard',
      });
    } catch (err) {
      console.error('Error signing in with Google:', err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Button variant="outline" className="flex items-center gap-2" onClick={signInWithGoogle}>
        <FcGoogle className="h-5 w-5" />
        Sign in with Google
      </Button>
    </div>
  );
}
