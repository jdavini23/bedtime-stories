-- Stories table policies
CREATE POLICY "Users can view their own stories" 
ON public.stories FOR SELECT 
USING (auth.uid()::text IN (SELECT auth_id FROM users WHERE id = user_id));

CREATE POLICY "Users can insert their own stories" 
ON public.stories FOR INSERT 
WITH CHECK (auth.uid()::text IN (SELECT auth_id FROM users WHERE id = user_id));

CREATE POLICY "Users can update their own stories" 
ON public.stories FOR UPDATE 
USING (auth.uid()::text IN (SELECT auth_id FROM users WHERE id = user_id));

CREATE POLICY "Users can delete their own stories" 
ON public.stories FOR DELETE 
USING (auth.uid()::text IN (SELECT auth_id FROM users WHERE id = user_id));

-- User metadata policies
CREATE POLICY "Users can view their own metadata" 
ON public.user_metadata FOR SELECT 
USING (auth.uid()::text IN (SELECT auth_id FROM users WHERE id = user_id));

CREATE POLICY "Users can update their own metadata" 
ON public.user_metadata FOR UPDATE 
USING (auth.uid()::text IN (SELECT auth_id FROM users WHERE id = user_id));

CREATE POLICY "Users can insert their own metadata" 
ON public.user_metadata FOR INSERT 
WITH CHECK (auth.uid()::text IN (SELECT auth_id FROM users WHERE id = user_id));

-- Preferences table policies
CREATE POLICY "Users can view their own preferences" 
ON public.preferences FOR SELECT 
USING (auth.uid()::text IN (SELECT auth_id FROM users WHERE id = user_id));

CREATE POLICY "Users can insert their own preferences" 
ON public.preferences FOR INSERT 
WITH CHECK (auth.uid()::text IN (SELECT auth_id FROM users WHERE id = user_id));

CREATE POLICY "Users can update their own preferences" 
ON public.preferences FOR UPDATE 
USING (auth.uid()::text IN (SELECT auth_id FROM users WHERE id = user_id));

CREATE POLICY "Users can delete their own preferences" 
ON public.preferences FOR DELETE 
USING (auth.uid()::text IN (SELECT auth_id FROM users WHERE id = user_id));

-- Subscriptions table policies
CREATE POLICY "Users can view their own subscriptions" 
ON public.subscriptions FOR SELECT 
USING (auth.uid()::text IN (SELECT auth_id FROM users WHERE id = user_id));

CREATE POLICY "Users can insert their own subscriptions" 
ON public.subscriptions FOR INSERT 
WITH CHECK (auth.uid()::text IN (SELECT auth_id FROM users WHERE id = user_id));

CREATE POLICY "Users can update their own subscriptions" 
ON public.subscriptions FOR UPDATE 
USING (auth.uid()::text IN (SELECT auth_id FROM users WHERE id = user_id));

CREATE POLICY "Users can delete their own subscriptions" 
ON public.subscriptions FOR DELETE 
USING (auth.uid()::text IN (SELECT auth_id FROM users WHERE id = user_id));
