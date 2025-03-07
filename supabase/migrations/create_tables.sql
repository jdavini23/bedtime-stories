-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_metadata table
CREATE TABLE IF NOT EXISTS public.user_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT user_metadata_user_id_key UNIQUE (user_id)
);

-- Create stories table (referenced in the verification function)
CREATE TABLE IF NOT EXISTS public.stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid()::text = auth_id);

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid()::text = auth_id);

-- Create policies for user_metadata table
CREATE POLICY "Users can view their own metadata" ON public.user_metadata
  FOR SELECT USING (
    user_id IN (
      SELECT id FROM public.users WHERE auth_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can update their own metadata" ON public.user_metadata
  FOR UPDATE USING (
    user_id IN (
      SELECT id FROM public.users WHERE auth_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert their own metadata" ON public.user_metadata
  FOR INSERT WITH CHECK (
    user_id IN (
      SELECT id FROM public.users WHERE auth_id = auth.uid()::text
    )
  );

-- Create policies for stories table
CREATE POLICY "Users can view their own stories" ON public.stories
  FOR SELECT USING (
    user_id IN (
      SELECT id FROM public.users WHERE auth_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert their own stories" ON public.stories
  FOR INSERT WITH CHECK (
    user_id IN (
      SELECT id FROM public.users WHERE auth_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can update their own stories" ON public.stories
  FOR UPDATE USING (
    user_id IN (
      SELECT id FROM public.users WHERE auth_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can delete their own stories" ON public.stories
  FOR DELETE USING (
    user_id IN (
      SELECT id FROM public.users WHERE auth_id = auth.uid()::text
    )
  );

-- Create a function to handle user creation from Clerk
CREATE OR REPLACE FUNCTION public.handle_clerk_user_creation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (auth_id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (auth_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to update user metadata from Clerk
CREATE OR REPLACE FUNCTION public.handle_clerk_metadata_update()
RETURNS TRIGGER AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Find the user by auth_id
  SELECT id INTO user_record FROM public.users WHERE auth_id = NEW.id;
  
  -- If user exists, update their metadata
  IF FOUND THEN
    INSERT INTO public.user_metadata (user_id, metadata)
    VALUES (user_record.id, NEW.raw_app_metadata::jsonb)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      metadata = NEW.raw_app_metadata::jsonb,
      updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT ALL ON public.users TO anon, authenticated;
GRANT ALL ON public.user_metadata TO anon, authenticated;
GRANT ALL ON public.stories TO anon, authenticated;
