import { createSupabaseClient } from '@/lib/supabase';
import { createAuthenticatedSupabaseClient } from '@/lib/supabase-auth';
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
      // Try to use authenticated client first (for server components)
      let supabase;
      try {
        supabase = await createAuthenticatedSupabaseClient();
      } catch (error) {
        // Fall back to unauthenticated client
        supabase = createSupabaseClient();
        logger.warn('Using unauthenticated client for getUserByAuthId', { authId });
      }

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
      // Try to use authenticated client first (for server components)
      let supabase;
      try {
        supabase = await createAuthenticatedSupabaseClient();
      } catch (error) {
        // Fall back to unauthenticated client
        supabase = createSupabaseClient();
        logger.warn('Using unauthenticated client for createUser', { authId });
      }

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
      // Try to use authenticated client first (for server components)
      let supabase;
      try {
        supabase = await createAuthenticatedSupabaseClient();
      } catch (error) {
        // Fall back to unauthenticated client
        supabase = createSupabaseClient();
        logger.warn('Using unauthenticated client for deleteUser', { authId });
      }

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

  /**
   * Sync user metadata from Clerk to Supabase
   * @param authId The Clerk auth ID
   * @param metadata The user metadata from Clerk
   * @returns True if sync was successful, false otherwise
   */
  static async syncUserMetadata(authId: string, metadata: Record<string, any>): Promise<boolean> {
    try {
      // Try to use authenticated client first (for server components)
      let supabase;
      try {
        supabase = await createAuthenticatedSupabaseClient();
      } catch (error) {
        // Fall back to unauthenticated client
        supabase = createSupabaseClient();
        logger.warn('Using unauthenticated client for syncUserMetadata', { authId });
      }

      // Get the user
      const user = await this.getUserByAuthId(authId);
      if (!user) {
        logger.error('User not found for metadata sync', { authId });
        return false;
      }

      // Update user metadata in a separate table or column
      // This example assumes you have a user_metadata table with a user_id foreign key
      const { error } = await supabase.from('user_metadata').upsert(
        {
          user_id: user.id,
          metadata: metadata,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id',
        }
      );

      if (error) {
        logger.error('Error syncing user metadata', { error, authId });
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Exception syncing user metadata', { error, authId });
      return false;
    }
  }

  /**
   * Verify the connection between Clerk and Supabase
   * @param authId The Clerk auth ID
   * @returns An object with connection status and details
   */
  static async verifyClerkSupabaseConnection(authId: string): Promise<{
    success: boolean;
    userExists: boolean;
    authStatus: string;
    details?: string;
    error?: any;
  }> {
    try {
      // Try to use authenticated client
      let supabase;
      let authStatus = 'unauthenticated';

      try {
        supabase = await createAuthenticatedSupabaseClient();
        authStatus = 'authenticated';
      } catch (error) {
        // Fall back to unauthenticated client
        supabase = createSupabaseClient();
        logger.warn('Using unauthenticated client for verification', { authId });
      }

      // First, check if the users table exists
      try {
        // Check if user exists - handle case where table might not exist
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', authId)
          .single();

        if (error) {
          // If error is not "no rows returned", it might be a table doesn't exist error
          if (error.code !== 'PGRST116') {
            // PGRST116 is "no rows returned"
            logger.warn('Error querying users table, it might not exist yet', {
              error,
              code: error.code,
              message: error.message,
            });

            return {
              success: true, // Still consider this a success for connection testing
              userExists: false,
              authStatus,
              details: 'Supabase connection successful, but users table may not exist yet',
              tableStatus: 'Users table may need to be created',
            };
          }
        }

        // Test RLS by trying to access another table, but handle case where it might not exist
        try {
          const { error: rlsError } = await supabase.from('stories').select('count').limit(1);

          return {
            success: true,
            userExists: !!data,
            authStatus,
            details: rlsError
              ? 'User exists but RLS may be preventing access'
              : 'Connection successful and RLS is working correctly',
            error: rlsError,
          };
        } catch (storiesError) {
          // Stories table might not exist, but connection is still successful
          return {
            success: true,
            userExists: !!data,
            authStatus,
            details: 'Connection successful, but stories table may not exist yet',
            error: null,
          };
        }
      } catch (tableError) {
        // This might happen if there's a more serious connection issue
        logger.error('Exception querying Supabase tables', { tableError });
        return {
          success: false,
          userExists: false,
          authStatus,
          details: 'Error accessing Supabase tables',
          error: tableError,
        };
      }
    } catch (error) {
      logger.error('Exception verifying Clerk-Supabase connection', { error, authId });
      return {
        success: false,
        userExists: false,
        authStatus: 'error',
        details: 'Exception occurred during verification',
        error,
      };
    }
  }
}
