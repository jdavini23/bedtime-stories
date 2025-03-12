import { createSupabaseClient } from '@/lib/supabase';
import { Preference } from '@/types/supabase';
import { logger } from '@/utils/logger';
import { SupabaseUserService } from './supabaseUserService';

/**
 * Service for handling user preferences with Supabase
 */
export class SupabasePreferencesService {
  /**
   * Get preferences for a user
   * @param authId The Clerk auth ID
   * @returns The user preferences or null if not found
   */
  static async getPreferences(authId: string): Promise<Preference | null> {
    try {
      const user = await SupabaseUserService.getUserByAuthId(authId);
      if (!user) {
        logger.warn('User not found when fetching preferences', { authId });
        return null;
      }

      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from('preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // If no preferences found, return null but don't log as error
        if (error.code === 'PGRST116') {
          logger.info('No preferences found for user', { authId });
          return null;
        }

        logger.error('Error fetching preferences', { error, authId });
        return null;
      }

      return data as Preference;
    } catch (error) {
      logger.error('Exception fetching preferences', { error, authId });
      return null;
    }
  }

  /**
   * Save or update preferences for a user
   * @param authId The Clerk auth ID
   * @param preferences The preferences object
   * @returns The saved preferences or null if saving failed
   */
  static async savePreferences(
    authId: string,
    preferences: Record<string, any>
  ): Promise<Preference | null> {
    try {
      const user = await SupabaseUserService.getUserByAuthId(authId);
      if (!user) {
        logger.warn('User not found when saving preferences', { authId });
        return null;
      }

      const supabase = createSupabaseClient();

      // Check if preferences already exist
      const existingPrefs = await this.getPreferences(authId);

      if (existingPrefs) {
        // Update existing preferences
        const { data, error } = await supabase
          .from('preferences')
          .update({
            preferences: preferences,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingPrefs.id)
          .select()
          .single();

        if (error) {
          logger.error('Error updating preferences', { error, authId });
          return null;
        }

        return data as Preference;
      } else {
        // Create new preferences
        const { data, error } = await supabase
          .from('preferences')
          .insert({
            preferences: preferences,
            user_id: user.id,
          })
          .select()
          .single();

        if (error) {
          logger.error('Error creating preferences', { error, authId });
          return null;
        }

        return data as Preference;
      }
    } catch (error) {
      logger.error('Exception saving preferences', { error, authId });
      return null;
    }
  }

  /**
   * Update specific preference values for a user
   * @param authId The Clerk auth ID
   * @param key The preference key to update
   * @param value The new value
   * @returns The updated preferences or null if update failed
   */
  static async updatePreference(
    authId: string,
    key: string,
    value: any
  ): Promise<Preference | null> {
    try {
      // Get current preferences
      const currentPrefs = await this.getPreferences(authId);

      // Create or update preferences
      const newPrefs = {
        ...(currentPrefs?.preferences || {}),
        [key]: value,
      };

      return await this.savePreferences(authId, newPrefs);
    } catch (error) {
      logger.error('Exception updating preference', { error, authId, key });
      return null;
    }
  }

  /**
   * Delete preferences for a user
   * @param authId The Clerk auth ID
   * @returns True if deletion was successful, false otherwise
   */
  static async deletePreferences(authId: string): Promise<boolean> {
    try {
      const user = await SupabaseUserService.getUserByAuthId(authId);
      if (!user) {
        logger.warn('User not found when deleting preferences', { authId });
        return false;
      }

      const supabase = createSupabaseClient();
      const { error } = await supabase.from('preferences').delete().eq('user_id', user.id);

      if (error) {
        logger.error('Error deleting preferences', { error, authId });
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Exception deleting preferences', { error, authId });
      return false;
    }
  }
}
