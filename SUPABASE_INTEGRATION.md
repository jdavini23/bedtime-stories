# Supabase Integration and RLS Policies

## Overview

This document provides an overview of the Supabase integration in the Bedtime Story Magic
application, including the database schema, Row Level Security (RLS) policies, and connection
testing.

## Database Schema

The database schema includes the following tables:

- `users`: Stores user information synchronized from Clerk
- `stories`: Stores generated bedtime stories
- `preferences`: Stores user preferences for story generation
- `subscriptions`: Stores user subscription information

## Row Level Security (RLS) Policies

RLS policies have been implemented to secure the database:

### For Unauthenticated Users

- Deny all access to all tables

### For Authenticated Users

- `users`: Users can only read and update their own data
- `stories`: Users can only read, insert, update, and delete their own stories
- `preferences`: Users can only read, insert, update, and delete their own preferences
- `subscriptions`: Users can only read, insert, update, and delete their own subscription data

### For Service Role

- Full access to all tables for administrative purposes

## Connection Testing

Several test scripts have been created to verify the Supabase connection and RLS policies:

- `test-supabase-connection.js`: Tests basic connection to Supabase
- `check-tables.js`: Verifies the existence of required tables
- `test-tables-and-rls.js`: Tests both table existence and RLS policies
- `test-rls-policies-final.js`: Final verification of RLS policies

## SQL Scripts

The following SQL scripts have been created:

- `supabase-schema.sql`: Creates the database schema
- `fix-rls-policies.sql`: Updates RLS policies to be more restrictive
- `simple-rls-fix.sql`: Simplified RLS policy fixes
- `deny-all-access.sql`: Denies all access to unauthenticated users

## Supabase Services

The following services have been implemented:

- `supabaseUserService.ts`: Manages user operations
- `supabaseStoryService.ts`: Manages story operations
- `supabasePreferencesService.ts`: Manages user preferences

## Webhook Integration

A webhook handler has been implemented to sync Clerk user data to Supabase:

- `src/app/api/webhook/clerk/route.ts`: Handles Clerk webhook events

## Next Steps

1. Implement authentication in the frontend to ensure proper access to Supabase resources
2. Add subscription management functionality
3. Integrate story generation with user preferences
4. Implement proper error handling for Supabase operations
