import { currentUser } from '@clerk/nextjs/server';
import { getAuth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isAdmin } from '@/utils/auth';

export default async function AdminDashboardPage() {
  try {
    // Get authentication data
    const auth = getAuth();
    const { userId } = auth;

    // Redirect if not authenticated
    if (!userId) {
      redirect('/sign-in?redirect_url=/admin');
    }

    // Get the current user data
    const user = await currentUser();

    // Check if user is an admin
    if (!user || !isAdmin(user)) {
      return (
        <div className="p-8 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h1>
          <p className="mb-4">You do not have permission to access the admin dashboard.</p>
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Return to Dashboard
          </Link>
        </div>
      );
    }

    // Admin dashboard content
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Management Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Manage user accounts, roles, and permissions.
            </p>
            <Link
              href="/admin/users"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View Users →
            </Link>
          </div>

          {/* Content Management Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Content Management</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Manage stories, themes, and content moderation.
            </p>
            <Link
              href="/admin/content"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Manage Content →
            </Link>
          </div>

          {/* System Settings Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">System Settings</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Configure application settings and API integrations.
            </p>
            <Link
              href="/admin/settings"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              System Settings →
            </Link>
          </div>

          {/* Analytics Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Analytics</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              View usage statistics and performance metrics.
            </p>
            <Link
              href="/admin/analytics"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View Analytics →
            </Link>
          </div>

          {/* API Keys Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">API Management</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Manage API keys and service integrations.
            </p>
            <Link
              href="/admin/api-keys"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Manage API Keys →
            </Link>
          </div>

          {/* Logs Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">System Logs</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              View system logs and error reports.
            </p>
            <Link
              href="/admin/logs"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View Logs →
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    // Handle auth errors
    console.error('Admin page auth error:', error);
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Authentication Error</h1>
        <p className="mb-4">
          There was a problem authenticating your request. Please sign in and try again.
        </p>
        <Link
          href="/sign-in?redirect_url=/admin"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          Sign In
        </Link>
      </div>
    );
  }
}
