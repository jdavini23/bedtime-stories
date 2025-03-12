import { createClient } from '@supabase/supabase-js';
import { logger } from '@/utils/loggerInstance';
import { Database } from '@/types/supabase';

/**
 * Service for handling user operations with Supabase
 */
export class UserService {
  private static supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  /**
   * Get a user by their Supabase auth ID
   * @param userId The Supabase user ID
   * @returns The user record or null if not found
   */
  static async getUserById(userId: string) {
    try {
      const { data: user, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        logger.error('Error fetching user by ID', { error, userId });
        return null;
      }

      return user;
    } catch (error) {
      logger.error('Exception fetching user by ID', { error, userId });
      return null;
    }
  }

  /**
   * Create a new user
   * @param userId The Supabase user ID
   * @param email The user's email
   * @returns The created user record or null if creation failed
   */
  static async createUser(userId: string, email: string) {
    try {
      const { data: user, error } = await this.supabase
        .from('users')
        .insert([{ id: userId, email }])
        .select()
        .single();

      if (error) {
        logger.error('Error creating user', { error, userId, email });
        return null;
      }

      return user;
    } catch (error) {
      logger.error('Exception creating user', { error, userId, email });
      return null;
    }
  }

  /**
   * Update a user's metadata
   * @param userId The Supabase user ID
   * @param metadata The user metadata to update
   * @returns The updated user record or null if update failed
   */
  static async updateUserMetadata(userId: string, metadata: Record<string, unknown>) {
    try {
      const { data: user, error } = await this.supabase
        .from('users')
        .update({ metadata })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        logger.error('Error updating user metadata', { error, userId });
        return null;
      }

      return user;
    } catch (error) {
      logger.error('Exception updating user metadata', { error, userId });
      return null;
    }
  }

  /**
   * Delete a user and all their associated data
   * @param userId The Supabase user ID
   * @returns true if deletion was successful, false otherwise
   */
  static async deleteUser(userId: string) {
    try {
      const { error } = await this.supabase.from('users').delete().eq('id', userId);

      if (error) {
        logger.error('Error deleting user', { error, userId });
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Exception deleting user', { error, userId });
      return false;
    }
  }

  /**
   * Get all users (admin only)
   * @returns Array of user records or null if fetch failed
   */
  static async getAllUsers() {
    try {
      const { data: users, error } = await this.supabase.from('users').select('*');

      if (error) {
        logger.error('Error fetching all users', { error });
        return null;
      }

      return users;
    } catch (error) {
      logger.error('Exception fetching all users', { error });
      return null;
    }
  }
}
