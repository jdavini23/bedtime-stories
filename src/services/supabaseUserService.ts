import { createSupabaseClient } from '@/lib/supabase';
import { User } from '@/types/supabase';
import { logger } from '@/utils/logger';

/**
 * Service for handling user operations with Supabase
 */
export class SupabaseUserService {
  /**
   * Get a user by their Clerk auth ID
   * @param authId The Clerk auth ID
   * @returns The user or null if not found
   */
  static async getUserByAuthId(authId: string): Promise<User | null> {
    try {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', authId)
        .single();

      if (error) {
        logger.error('Error fetching user by auth ID', { error, authId });
        return null;
      }

      return data as User;
    } catch (error) {
      logger.error('Exception fetching user by auth ID', { error, authId });
      return null;
    }
  }

  /**
   * Create a new user in Supabase
   * @param authId The Clerk auth ID
   * @param email The user's email
   * @returns The created user or null if creation failed
   */
  static async createUser(authId: string, email: string): Promise<User | null> {
    try {
      const supabase = createSupabaseClient();

      // Check if user already exists
      const existingUser = await this.getUserByAuthId(authId);
      if (existingUser) {
        return existingUser;
      }

      // Create new user
      const { data, error } = await supabase
        .from('users')
        .insert({
          auth_id: authId,
          email: email,
        })
        .select()
        .single();

      if (error) {
        logger.error('Error creating user', { error, authId, email });
        return null;
      }

      return data as User;
    } catch (error) {
      logger.error('Exception creating user', { error, authId, email });
      return null;
    }
  }

  /**
   * Get or create a user in Supabase
   * @param authId The Clerk auth ID
   * @param email The user's email
   * @returns The user or null if not found/created
   */
  static async getOrCreateUser(authId: string, email: string): Promise<User | null> {
    const user = await this.getUserByAuthId(authId);
    if (user) {
      return user;
    }

    return await this.createUser(authId, email);
  }

  /**
   * Delete a user from Supabase
   * @param authId The Clerk auth ID
   * @returns True if deletion was successful, false otherwise
   */
  static async deleteUser(authId: string): Promise<boolean> {
    try {
      const supabase = createSupabaseClient();
      const { error } = await supabase.from('users').delete().eq('auth_id', authId);

      if (error) {
        logger.error('Error deleting user', { error, authId });
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Exception deleting user', { error, authId });
      return false;
    }
  }
}
