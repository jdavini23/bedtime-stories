import { createSupabaseClient } from '@/lib/supabase';
import { Story } from '@/types/supabase';
import { logger } from '@/utils/logger';
import { SupabaseUserService } from './supabaseUserService';

/**
 * Service for handling story operations with Supabase
 */
export class SupabaseStoryService {
  /**
   * Get a story by its ID
   * @param storyId The story ID
   * @returns The story or null if not found
   */
  static async getStoryById(storyId: string): Promise<Story | null> {
    try {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase.from('stories').select('*').eq('id', storyId).single();

      if (error) {
        logger.error('Error fetching story by ID', { error, storyId });
        return null;
      }

      return data as Story;
    } catch (error) {
      logger.error('Exception fetching story by ID', { error, storyId });
      return null;
    }
  }

  /**
   * Get all stories for a user
   * @param authId The Clerk auth ID
   * @returns Array of stories or empty array if none found
   */
  static async getStoriesByUser(authId: string): Promise<Story[]> {
    try {
      const user = await SupabaseUserService.getUserByAuthId(authId);
      if (!user) {
        logger.warn('User not found when fetching stories', { authId });
        return [];
      }

      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Error fetching stories for user', { error, authId });
        return [];
      }

      return data as Story[];
    } catch (error) {
      logger.error('Exception fetching stories for user', { error, authId });
      return [];
    }
  }

  /**
   * Save a story to Supabase
   * @param authId The Clerk auth ID
   * @param title The story title
   * @param content The story content
   * @returns The saved story or null if saving failed
   */
  static async saveStory(authId: string, title: string, content: string): Promise<Story | null> {
    try {
      const user = await SupabaseUserService.getUserByAuthId(authId);
      if (!user) {
        logger.warn('User not found when saving story', { authId });
        return null;
      }

      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from('stories')
        .insert({
          title,
          content,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        logger.error('Error saving story', { error, authId });
        return null;
      }

      return data as Story;
    } catch (error) {
      logger.error('Exception saving story', { error, authId });
      return null;
    }
  }

  /**
   * Update a story in Supabase
   * @param storyId The story ID
   * @param authId The Clerk auth ID (for authorization)
   * @param updates The story updates
   * @returns The updated story or null if update failed
   */
  static async updateStory(
    storyId: string,
    authId: string,
    updates: Partial<Pick<Story, 'title' | 'content'>>
  ): Promise<Story | null> {
    try {
      const user = await SupabaseUserService.getUserByAuthId(authId);
      if (!user) {
        logger.warn('User not found when updating story', { authId });
        return null;
      }

      // Verify the story belongs to the user
      const story = await this.getStoryById(storyId);
      if (!story || story.user_id !== user.id) {
        logger.warn('Story not found or not owned by user', { storyId, authId });
        return null;
      }

      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from('stories')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', storyId)
        .select()
        .single();

      if (error) {
        logger.error('Error updating story', { error, storyId, authId });
        return null;
      }

      return data as Story;
    } catch (error) {
      logger.error('Exception updating story', { error, storyId, authId });
      return null;
    }
  }

  /**
   * Delete a story from Supabase
   * @param storyId The story ID
   * @param authId The Clerk auth ID (for authorization)
   * @returns True if deletion was successful, false otherwise
   */
  static async deleteStory(storyId: string, authId: string): Promise<boolean> {
    try {
      const user = await SupabaseUserService.getUserByAuthId(authId);
      if (!user) {
        logger.warn('User not found when deleting story', { authId });
        return false;
      }

      // Verify the story belongs to the user
      const story = await this.getStoryById(storyId);
      if (!story || story.user_id !== user.id) {
        logger.warn('Story not found or not owned by user', { storyId, authId });
        return false;
      }

      const supabase = createSupabaseClient();
      const { error } = await supabase.from('stories').delete().eq('id', storyId);

      if (error) {
        logger.error('Error deleting story', { error, storyId, authId });
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Exception deleting story', { error, storyId, authId });
      return false;
    }
  }
}
