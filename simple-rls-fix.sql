-- Enable RLS on all tables
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if any)
DROP POLICY IF EXISTS "Users can view their own stories" ON stories;
DROP POLICY IF EXISTS "Users can insert their own stories" ON stories;
DROP POLICY IF EXISTS "Users can update their own stories" ON stories;
DROP POLICY IF EXISTS "Users can delete their own stories" ON stories;

DROP POLICY IF EXISTS "Users can view their own preferences" ON preferences;
DROP POLICY IF EXISTS "Users can insert their own preferences" ON preferences;
DROP POLICY IF EXISTS "Users can update their own preferences" ON preferences;
DROP POLICY IF EXISTS "Users can delete their own preferences" ON preferences;

DROP POLICY IF EXISTS "Users can view their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can delete their own subscriptions" ON subscriptions;

-- Create simple deny-all policies for unauthenticated users
-- This will block all access to tables for unauthenticated users

-- Stories table
CREATE POLICY "Deny access to unauthenticated users for stories" 
ON stories 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Preferences table
CREATE POLICY "Deny access to unauthenticated users for preferences" 
ON preferences 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Subscriptions table
CREATE POLICY "Deny access to unauthenticated users for subscriptions" 
ON subscriptions 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Users table
CREATE POLICY "Deny access to unauthenticated users for users" 
ON users 
FOR ALL 
USING (auth.role() = 'authenticated'); 