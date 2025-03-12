import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { logger } from '@/utils/logger';
import { PostgrestError } from '@supabase/supabase-js';

interface UserPreferences {
  theme?: 'light' | 'dark';
  fontSize?: 'small' | 'medium' | 'large';
  language?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
  };
}

export class UserPreferencesService {
  private static instance: UserPreferencesService;
  private cache = new Map<string, UserPreferences>();

  private constructor() {}

  static getInstance(): UserPreferencesService {
    if (!UserPreferencesService.instance) {
      UserPreferencesService.instance = new UserPreferencesService();
    }
    return UserPreferencesService.instance;
  }

  private async getSupabaseClient() {
    const cookieStore = cookies();
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );
  }

  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      // Check cache first
      const cachedPreferences = this.cache.get(userId);
      if (cachedPreferences) {
        return cachedPreferences;
      }

      const supabase = await this.getSupabaseClient();
      const { data, error } = await supabase
        .from('user_preferences')
        .select('preferences')
        .eq('user_id', userId)
        .single();

      if (error) {
        logger.error('Error fetching user preferences:', { error: error.message });
        return null;
      }

      const preferences = data?.preferences as UserPreferences;
      if (preferences) {
        this.cache.set(userId, preferences);
      }

      return preferences || null;
    } catch (error) {
      logger.error('Error in getUserPreferences:', { error: String(error) });
      return null;
    }
  }

  async updateUserPreferences(
    userId: string,
    updates: Partial<UserPreferences>
  ): Promise<UserPreferences | null> {
    try {
      const supabase = await this.getSupabaseClient();
      const { error } = await supabase.from('user_preferences').upsert({
        user_id: userId,
        preferences: updates,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        logger.error('Error updating user preferences:', { error: error.message });
        return null;
      }

      // Update cache
      const currentPreferences = await this.getUserPreferences(userId);
      const updatedPreferences = {
        ...currentPreferences,
        ...updates,
      };
      this.cache.set(userId, updatedPreferences);

      return updatedPreferences;
    } catch (error) {
      logger.error('Error in updateUserPreferences:', { error: String(error) });
      return null;
    }
  }

  async deleteUserPreferences(userId: string): Promise<void> {
    try {
      const supabase = await this.getSupabaseClient();
      const { error } = await supabase.from('user_preferences').delete().eq('user_id', userId);

      if (error) {
        logger.error('Error deleting user preferences:', { error: error.message });
        throw error;
      }

      this.cache.delete(userId);
    } catch (error) {
      logger.error('Error in deleteUserPreferences:', { error: String(error) });
      throw error;
    }
  }
}
