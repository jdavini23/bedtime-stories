import { createClient } from '@supabase/supabase-js';
import { logger } from '@/utils/loggerInstance';
import { Database } from '@/types/supabase';

/**
 * Service for handling user preferences with Supabase
 */
export class PreferencesService {
  private static supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  /**
   * Get user preferences
   * @param userId The Supabase user ID
   * @returns The user preferences or null if not found
   */
  static async getUserPreferences(userId: string) {
    try {
      const { data: preferences, error } = await this.supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        logger.error('Error fetching user preferences', { error, userId });
        return null;
      }

      return preferences;
    } catch (error) {
      logger.error('Exception fetching user preferences', { error, userId });
      return null;
    }
  }

  /**
   * Update user preferences
   * @param userId The Supabase user ID
   * @param preferences The preferences to update
   * @returns The updated preferences or null if update failed
   */
  static async updateUserPreferences(userId: string, preferences: Record<string, unknown>) {
    try {
      const { data: updatedPreferences, error } = await this.supabase
        .from('user_preferences')
        .upsert(
          {
            user_id: userId,
            preferences,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id',
          }
        )
        .select()
        .single();

      if (error) {
        logger.error('Error updating user preferences', { error, userId });
        return null;
      }

      return updatedPreferences;
    } catch (error) {
      logger.error('Exception updating user preferences', { error, userId });
      return null;
    }
  }

  /**
   * Delete user preferences
   * @param userId The Supabase user ID
   * @returns true if deletion was successful, false otherwise
   */
  static async deleteUserPreferences(userId: string) {
    try {
      const { error } = await this.supabase.from('user_preferences').delete().eq('user_id', userId);

      if (error) {
        logger.error('Error deleting user preferences', { error, userId });
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Exception deleting user preferences', { error, userId });
      return false;
    }
  }
}
