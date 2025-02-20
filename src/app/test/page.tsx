export default function TestPage() {
  // Safely access environment variables with fallback
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'N/A',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'N/A',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'N/A',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'N/A',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'N/A',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'N/A',
  };

  return (
    <div>
      <h1>Test Firebase Configuration</h1>
      <pre>
        {JSON.stringify(firebaseConfig, null, 2)}
      </pre>
    </div>
  );
}
