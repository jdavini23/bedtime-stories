-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stories Table
CREATE TABLE IF NOT EXISTS stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- Preferences Table
CREATE TABLE IF NOT EXISTS preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  preferences JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE
);

-- Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Users table policies
CREATE POLICY "Users can view their own data" 
ON users FOR SELECT 
USING (auth.uid()::text = auth_id);

-- Stories table policies
CREATE POLICY "Users can view their own stories" 
ON stories FOR SELECT 
USING (auth.uid()::text IN (SELECT auth_id FROM users WHERE id = user_id));

CREATE POLICY "Users can insert their own stories" 
ON stories FOR INSERT 
WITH CHECK (auth.uid()::text IN (SELECT auth_id FROM users WHERE id = user_id));

CREATE POLICY "Users can update their own stories" 
ON stories FOR UPDATE 
USING (auth.uid()::text IN (SELECT auth_id FROM users WHERE id = user_id));

CREATE POLICY "Users can delete their own stories" 
ON stories FOR DELETE 
USING (auth.uid()::text IN (SELECT auth_id FROM users WHERE id = user_id));

-- Preferences table policies
CREATE POLICY "Users can view their own preferences" 
ON preferences FOR SELECT 
USING (auth.uid()::text IN (SELECT auth_id FROM users WHERE id = user_id));

CREATE POLICY "Users can insert their own preferences" 
ON preferences FOR INSERT 
WITH CHECK (auth.uid()::text IN (SELECT auth_id FROM users WHERE id = user_id));

CREATE POLICY "Users can update their own preferences" 
ON preferences FOR UPDATE 
USING (auth.uid()::text IN (SELECT auth_id FROM users WHERE id = user_id));

CREATE POLICY "Users can delete their own preferences" 
ON preferences FOR DELETE 
USING (auth.uid()::text IN (SELECT auth_id FROM users WHERE id = user_id));

-- Subscriptions table policies
CREATE POLICY "Users can view their own subscriptions" 
ON subscriptions FOR SELECT 
USING (auth.uid()::text IN (SELECT auth_id FROM users WHERE id = user_id));

CREATE POLICY "Users can insert their own subscriptions" 
ON subscriptions FOR INSERT 
WITH CHECK (auth.uid()::text IN (SELECT auth_id FROM users WHERE id = user_id));

CREATE POLICY "Users can update their own subscriptions" 
ON subscriptions FOR UPDATE 
USING (auth.uid()::text IN (SELECT auth_id FROM users WHERE id = user_id));

CREATE POLICY "Users can delete their own subscriptions" 
ON subscriptions FOR DELETE 
USING (auth.uid()::text IN (SELECT auth_id FROM users WHERE id = user_id)); 