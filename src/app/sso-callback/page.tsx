import { AuthenticateWithRedirectCallback } from '@clerk/nextjs';
import { Loader2Icon } from 'lucide-react';

export default function SSOCallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Completing sign in...</p>
      </div>
      <AuthenticateWithRedirectCallback afterSignInUrl="/" afterSignUpUrl="/" />
    </div>
  );
}
