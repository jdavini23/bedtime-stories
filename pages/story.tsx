import { withServerSideAuth } from '@clerk/nextjs/ssr';
import { ThemeStep } from '../src/components/story/ThemeStep';
import { useUser } from '../src/hooks/useUser';
import { isAdmin } from '../src/utils/auth';

export default function StoryPage() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (isLoaded && isSignedIn && user && isAdmin(user as any)) {
    return (
      <div className="admin-test-panel">
        <h2>Admin Controls</h2>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <ThemeStep onComplete={(theme) => console.log('Selected theme:', theme)} />
    </div>
  );
}

export const getServerSideProps = withServerSideAuth(({ req }) => {
  return { props: {} };
});
StoryPage.auth = false;
