-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own data" ON users;
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

-- Make sure RLS is enabled on all tables
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create more restrictive policies

-- Users table policies
CREATE POLICY "Authenticated users can view their own profile" 
ON users FOR SELECT 
USING (
  auth.role() = 'authenticated' AND 
  auth.uid()::text = auth_id
);

CREATE POLICY "Authenticated users can update their own profile" 
ON users FOR UPDATE 
USING (
  auth.role() = 'authenticated' AND 
  auth.uid()::text = auth_id
);

-- Stories table policies
CREATE POLICY "Authenticated users can view their own stories" 
ON stories FOR SELECT 
USING (
  auth.role() = 'authenticated' AND 
  auth.uid()::text = (SELECT auth_id FROM users WHERE id = user_id)
);

CREATE POLICY "Authenticated users can insert their own stories" 
ON stories FOR INSERT 
WITH CHECK (
  auth.role() = 'authenticated' AND 
  auth.uid()::text = (SELECT auth_id FROM users WHERE id = user_id)
);

CREATE POLICY "Authenticated users can update their own stories" 
ON stories FOR UPDATE 
USING (
  auth.role() = 'authenticated' AND 
  auth.uid()::text = (SELECT auth_id FROM users WHERE id = user_id)
);

CREATE POLICY "Authenticated users can delete their own stories" 
ON stories FOR DELETE 
USING (
  auth.role() = 'authenticated' AND 
  auth.uid()::text = (SELECT auth_id FROM users WHERE id = user_id)
);

-- Preferences table policies
CREATE POLICY "Authenticated users can view their own preferences" 
ON preferences FOR SELECT 
USING (
  auth.role() = 'authenticated' AND 
  auth.uid()::text = (SELECT auth_id FROM users WHERE id = user_id)
);

CREATE POLICY "Authenticated users can insert their own preferences" 
ON preferences FOR INSERT 
WITH CHECK (
  auth.role() = 'authenticated' AND 
  auth.uid()::text = (SELECT auth_id FROM users WHERE id = user_id)
);

CREATE POLICY "Authenticated users can update their own preferences" 
ON preferences FOR UPDATE 
USING (
  auth.role() = 'authenticated' AND 
  auth.uid()::text = (SELECT auth_id FROM users WHERE id = user_id)
);

CREATE POLICY "Authenticated users can delete their own preferences" 
ON preferences FOR DELETE 
USING (
  auth.role() = 'authenticated' AND 
  auth.uid()::text = (SELECT auth_id FROM users WHERE id = user_id)
);

-- Subscriptions table policies
CREATE POLICY "Authenticated users can view their own subscriptions" 
ON subscriptions FOR SELECT 
USING (
  auth.role() = 'authenticated' AND 
  auth.uid()::text = (SELECT auth_id FROM users WHERE id = user_id)
);

CREATE POLICY "Authenticated users can insert their own subscriptions" 
ON subscriptions FOR INSERT 
WITH CHECK (
  auth.role() = 'authenticated' AND 
  auth.uid()::text = (SELECT auth_id FROM users WHERE id = user_id)
);

CREATE POLICY "Authenticated users can update their own subscriptions" 
ON subscriptions FOR UPDATE 
USING (
  auth.role() = 'authenticated' AND 
  auth.uid()::text = (SELECT auth_id FROM users WHERE id = user_id)
);

CREATE POLICY "Authenticated users can delete their own subscriptions" 
ON subscriptions FOR DELETE 
USING (
  auth.role() = 'authenticated' AND 
  auth.uid()::text = (SELECT auth_id FROM users WHERE id = user_id)
);

-- Add a policy for service role access (for admin operations)
CREATE POLICY "Service role has full access to all tables" 
ON users FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role has full access to all tables" 
ON stories FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role has full access to all tables" 
ON preferences FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role has full access to all tables" 
ON subscriptions FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role'); 