import { createClient } from '@supabase/supabase-js';
import { logger } from '@/utils/loggerInstance';
import { Database } from '@/types/supabase';

/**
 * Service for handling story operations with Supabase
 */
export class StoryService {
  private static supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  /**
   * Get all stories for a user
   * @param userId The Supabase user ID
   * @returns Array of stories or null if fetch failed
   */
  static async getUserStories(userId: string) {
    try {
      const { data: stories, error } = await this.supabase
        .from('stories')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Error fetching user stories', { error, userId });
        return null;
      }

      return stories;
    } catch (error) {
      logger.error('Exception fetching user stories', { error, userId });
      return null;
    }
  }

  /**
   * Get a story by ID
   * @param storyId The story ID
   * @param userId The Supabase user ID (for authorization)
   * @returns The story or null if not found
   */
  static async getStoryById(storyId: string, userId: string) {
    try {
      const { data: story, error } = await this.supabase
        .from('stories')
        .select('*')
        .eq('id', storyId)
        .eq('user_id', userId)
        .single();

      if (error) {
        logger.error('Error fetching story by ID', { error, storyId, userId });
        return null;
      }

      return story;
    } catch (error) {
      logger.error('Exception fetching story by ID', { error, storyId, userId });
      return null;
    }
  }

  /**
   * Create a new story
   * @param userId The Supabase user ID
   * @param title The story title
   * @param content The story content
   * @param metadata Optional metadata
   * @returns The created story or null if creation failed
   */
  static async createStory(
    userId: string,
    title: string,
    content: string,
    metadata: Record<string, unknown> = {}
  ) {
    try {
      const { data: story, error } = await this.supabase
        .from('stories')
        .insert([
          {
            user_id: userId,
            title,
            content,
            metadata,
          },
        ])
        .select()
        .single();

      if (error) {
        logger.error('Error creating story', { error, userId });
        return null;
      }

      return story;
    } catch (error) {
      logger.error('Exception creating story', { error, userId });
      return null;
    }
  }

  /**
   * Update a story
   * @param storyId The story ID
   * @param userId The Supabase user ID (for authorization)
   * @param updates The fields to update
   * @returns The updated story or null if update failed
   */
  static async updateStory(
    storyId: string,
    userId: string,
    updates: {
      title?: string;
      content?: string;
      metadata?: Record<string, unknown>;
    }
  ) {
    try {
      const { data: story, error } = await this.supabase
        .from('stories')
        .update(updates)
        .eq('id', storyId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        logger.error('Error updating story', { error, storyId, userId });
        return null;
      }

      return story;
    } catch (error) {
      logger.error('Exception updating story', { error, storyId, userId });
      return null;
    }
  }

  /**
   * Delete a story
   * @param storyId The story ID
   * @param userId The Supabase user ID (for authorization)
   * @returns true if deletion was successful, false otherwise
   */
  static async deleteStory(storyId: string, userId: string) {
    try {
      const { error } = await this.supabase
        .from('stories')
        .delete()
        .eq('id', storyId)
        .eq('user_id', userId);

      if (error) {
        logger.error('Error deleting story', { error, storyId, userId });
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Exception deleting story', { error, storyId, userId });
      return false;
    }
  }
}
