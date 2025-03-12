# Supabase Authentication Integration Guide

This document provides a comprehensive guide on how Supabase authentication is integrated into the
Bedtime Stories application.

## Overview

The application uses Supabase for both authentication and database functionality:

- **Authentication**: User registration, login, and session management
- **Database**: User profiles, stories, and application data storage
- **Row Level Security (RLS)**: Fine-grained access control for database tables

## Key Components

### 1. Authentication Provider

Located at `src/providers/SupabaseAuthProvider.tsx`, this provider creates and manages the Supabase
client, handles user authentication state, and provides authentication methods throughout the
application:

- `signIn(email, password)`: Sign in existing users
- `signUp(email, password)`: Register new users
- `signOut()`: Sign out the current user

### 2. Client-Side Hooks

- **useSupabase** (`src/providers/SupabaseAuthProvider.tsx`): Hook to access the Supabase client and
  authentication methods
- **useSupabaseClient** (`src/hooks/useSupabaseClient.ts`): Hook to create and manage a Supabase
  client
- **useSession** (`src/hooks/useSession.ts`): Hook to manage user session state

### 3. Server-Side Utilities

Located at `src/utils/supabase-server.ts`, these utilities help with server-side authentication:

- `createServerSupabaseClient()`: Creates a Supabase client for server components
- `createAdminSupabaseClient()`: Creates an admin client with full database access
- `getServerSession()`: Gets the current user session on the server
- `getServerUser()`: Gets the current user on the server
- `isAuthenticated()`: Checks if a user is authenticated

### 4. Middleware

Located at `src/middleware.ts`, this middleware protects routes that require authentication and
redirects users based on their authentication state.

## Authentication Flow

1. **User Registration**:

   - User submits email and password through the signup form
   - Supabase creates a new user and sends verification email (if configured)
   - User is redirected to login or home page (depending on email verification settings)

2. **User Login**:

   - User submits credentials through the login form
   - Supabase authenticates the user and creates a new session
   - User is redirected to the home page or protected route

3. **Session Management**:

   - Session is stored in cookies and automatically refreshed
   - `SupabaseAuthProvider` listens for auth state changes
   - Protected routes check for valid sessions using middleware

4. **User Logout**:
   - User clicks the logout button
   - Supabase destroys the session
   - User is redirected to the home page

## Setting Up Supabase

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project
3. Note your project URL and anon key

### 2. Configure Authentication Settings

1. Go to Authentication → Settings in your Supabase dashboard
2. Configure email templates and auth providers as needed
3. Set up redirect URLs for auth callbacks

### 3. Set Up Database Tables

Create these essential tables in your Supabase database:

```sql
-- Create a profiles table linked to auth.users
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create a trigger to create a profile when a user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### 4. Configure Environment Variables

Set these environment variables in your `.env` file and deployment platform:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (server-side only)
```

You can use the setup script with:

```
npm run setup:supabase
```

## Development Workflow

### Testing Authentication

To test the authentication flow locally:

1. Start the development server: `npm run dev`
2. Navigate to `/signup` to create a test account
3. Navigate to `/login` to test signing in
4. Use the navigation menu to test signing out

### Accessing Protected Routes

Routes under these paths require authentication:

- `/story` - Creating stories
- `/profile` - User profile
- `/admin` - Admin functions
- `/account` - Account settings

### Debugging Authentication Issues

Common issues and solutions:

1. **Session not persisting**: Check browser cookies and Supabase auth settings
2. **Authentication errors**: Check browser console for specific error messages
3. **RLS policy errors**: Verify Row Level Security policies in Supabase

## Best Practices

1. **Security**: Never expose the service role key in client-side code
2. **Error Handling**: Always handle authentication errors gracefully
3. **User Experience**: Provide clear feedback during auth processes
4. **Session Management**: Use the built-in hooks and avoid manual session handling

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
