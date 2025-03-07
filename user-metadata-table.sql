-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_metadata table
CREATE TABLE IF NOT EXISTS user_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_user_metadata UNIQUE (user_id)
);

-- Enable Row Level Security
ALTER TABLE user_metadata ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for user_metadata table
CREATE POLICY "Users can view their own metadata" 
ON user_metadata FOR SELECT 
USING (auth.uid()::text IN (SELECT auth_id FROM users WHERE id = user_id));

CREATE POLICY "Users can insert their own metadata" 
ON user_metadata FOR INSERT 
WITH CHECK (auth.uid()::text IN (SELECT auth_id FROM users WHERE id = user_id));

CREATE POLICY "Users can update their own metadata" 
ON user_metadata FOR UPDATE 
USING (auth.uid()::text IN (SELECT auth_id FROM users WHERE id = user_id));

CREATE POLICY "Users can delete their own metadata" 
ON user_metadata FOR DELETE 
USING (auth.uid()::text IN (SELECT auth_id FROM users WHERE id = user_id));
