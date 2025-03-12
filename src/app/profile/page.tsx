'use client';

import { useState, useEffect } from 'react';
import { useSupabase } from '@/providers/SupabaseAuthProvider';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { logger } from '@/utils/logger';

export default function ProfilePage() {
  const { supabase, user, loading } = useSupabase();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    // Load user profile data
    async function loadUserProfile() {
      if (!user || !supabase) return;

      try {
        // First, set the email from the auth user
        setEmail(user.email || '');

        // Then fetch additional user data from profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', user.id)
          .single();

        if (error) {
          logger.error('Error loading user profile', { error });
          return;
        }

        if (data && 'display_name' in data) {
          setDisplayName((data as { display_name: string }).display_name || '');
        }
      } catch (error) {
        logger.error('Error in loading user profile', { error });
      }
    }

    loadUserProfile();
  }, [user, supabase]);

  const handleSaveProfile = async () => {
    if (!user || !supabase) return;

    setIsSaving(true);
    setMessage(null);

    try {
      // Save profile data to the profiles table
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        display_name: displayName,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      setMessage({
        text: 'Profile updated successfully!',
        type: 'success',
      });

      logger.info('Profile updated successfully', { userId: user.id });
    } catch (error) {
      logger.error('Error updating profile', { error });
      setMessage({
        text: 'Failed to update profile. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cloud to-lavender/20 dark:from-midnight dark:to-primary/20 p-4 flex flex-col justify-center items-center">
        <div className="text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cloud to-lavender/20 dark:from-midnight dark:to-primary/20 p-4">
      <div className="container mx-auto py-8">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-dreamy p-8">
          <h1 className="text-3xl font-bold text-midnight dark:text-text-primary mb-6">
            Your Profile
          </h1>

          {message && (
            <div
              className={`mb-6 p-3 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="w-full bg-gray-100 dark:bg-gray-800"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Display Name
              </label>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full"
                placeholder="Your display name"
              />
            </div>

            <Button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary/90 hover:to-primary-light/90"
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
