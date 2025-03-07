# Clerk-Supabase Integration Guide

This document provides a comprehensive guide on how the Clerk authentication system is integrated
with Supabase in the Bedtime Stories application.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Setup Instructions](#setup-instructions)
4. [Security Considerations](#security-considerations)
5. [API Reference](#api-reference)
6. [Troubleshooting](#troubleshooting)
7. [Development Tools](#development-tools)

## Overview

The integration between Clerk and Supabase enables:

- Secure authentication via Clerk
- Automatic user synchronization between Clerk and Supabase
- Row Level Security (RLS) in Supabase based on Clerk authentication
- Consistent user management across both platforms

## Architecture

### Components

1. **Authentication Flow**

   - Clerk handles user authentication (sign-up, sign-in, sessions)
   - Clerk JWT is passed to Supabase for authenticated requests
   - Middleware ensures proper token passing

2. **User Synchronization**

   - Webhook handler processes Clerk user events
   - User data is synchronized from Clerk to Supabase
   - Metadata is kept in sync between platforms

3. **Security Layer**

   - Row Level Security (RLS) policies in Supabase
   - JWT verification for authenticated requests
   - Fallback mechanisms for unauthenticated scenarios

4. **Client Integration**
   - Server-side authenticated clients
   - Client-side hook for React components
   - Consistent error handling

## Setup Instructions

### Prerequisites

- Clerk account and project
- Supabase account and project
- NextJS application

### Environment Variables

Add these to your `.env.local` file:

```
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
```

### Clerk JWT Template Configuration

1. Go to your Clerk Dashboard → JWT Templates
2. Create a new template named "supabase"
3. Use the following claims:

```json
{
  "sub": "{{user.id}}",
  "aud": "authenticated",
  "role": "authenticated",
  "user_id": "{{user.id}}",
  "email": "{{user.primary_email_address}}",
  "exp": "{{exp}}",
  "iat": "{{iat}}"
}
```

### Supabase RLS Policies

Execute the SQL in `user-metadata-table.sql` to create the necessary tables and RLS policies.

Basic RLS policy example:

```sql
-- Enable RLS on the users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read/write only their own data
CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  USING (auth.uid() = auth_id);

CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  USING (auth.uid() = auth_id);
```

### Webhook Setup

1. Go to your Clerk Dashboard → Webhooks
2. Create a new webhook endpoint: `https://your-domain.com/api/webhook/clerk`
3. Select the following events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
4. Copy the signing secret to your `CLERK_WEBHOOK_SECRET` environment variable

## Security Considerations

### Best Practices

1. **Token Management**

   - Secure storage of JWT tokens
   - Proper token expiration handling
   - Refresh token rotation

2. **Error Handling**

   - Graceful degradation on authentication failures
   - Secure error messages (no sensitive information)
   - Comprehensive logging

3. **Data Protection**

   - RLS policies for all tables
   - Minimal permission scopes
   - Regular security audits

4. **Environment Isolation**
   - Separate development and production environments
   - Different API keys for each environment
   - Testing in isolated environments

## API Reference

### Supabase Authentication

```typescript
// Server-side authenticated client
import { createServerSupabaseClient } from '@/lib/supabase-auth';

const supabase = await createServerSupabaseClient();
const { data } = await supabase.from('users').select('*');
```

```typescript
// Client-side hook
import { useSupabaseClient } from '@/hooks/useSupabaseClient';

function Component() {
  const supabase = useSupabaseClient();

  async function fetchData() {
    const { data } = await supabase.from('users').select('*');
    // ...
  }
}
```

### User Service

```typescript
import { SupabaseUserService } from '@/services/supabaseUserService';

const userService = new SupabaseUserService();

// Create user
await userService.createUser({
  auth_id: 'clerk_user_id',
  email: 'user@example.com',
  first_name: 'John',
  last_name: 'Doe',
});

// Get user
const user = await userService.getUserByAuthId('clerk_user_id');

// Update user
await userService.updateUser('clerk_user_id', { first_name: 'Jane' });

// Delete user
await userService.deleteUser('clerk_user_id');

// Sync metadata
await userService.syncUserMetadata('clerk_user_id', {
  public_metadata: { preferences: { theme: 'dark' } },
  private_metadata: { notes: 'Internal use only' },
});
```

## Troubleshooting

### Common Issues

1. **Authentication Failures**

   - Check JWT template configuration
   - Verify environment variables
   - Ensure middleware is properly configured

2. **Missing User Data**

   - Verify webhook is receiving events
   - Check webhook signature validation
   - Inspect Supabase RLS policies

3. **Performance Issues**
   - Monitor token refresh frequency
   - Check for excessive database queries
   - Optimize client-side authentication state

### Debugging Tools

Visit `/debug/clerk-supabase` in your development environment to access the integration testing
tool.

## Development Tools

### Integration Test Component

The `ClerkSupabaseIntegrationTest` component provides a UI for testing the integration between Clerk
and Supabase. It allows you to:

- Verify authentication status
- Test API endpoints
- Check direct Supabase access
- View detailed error information

Access it at `/debug/clerk-supabase` in your development environment.

### API Test Endpoint

The `/api/test-integration` endpoint provides a server-side test of the integration. It returns:

- Authentication status
- Supabase connection status
- User synchronization status
- Detailed error information if applicable

---

This integration was developed by the Bedtime Stories team. For questions or support, please contact
the development team.
