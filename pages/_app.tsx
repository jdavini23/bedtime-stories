import { ClerkProvider, UserContextProvider } from '@clerk/nextjs';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider 
      frontendApi={process.env.NEXT_PUBLIC_CLERK_FRONTEND_API}
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      {...pageProps}
    >
      <UserContextProvider>
        <Component {...pageProps} />
      </UserContextProvider>
    </ClerkProvider>
  );
}

export default MyApp;
