import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit
} from 'firebase/firestore';
import { firestore } from '@/lib/firebaseConfig';
import { Story, StoryInput, StoryTheme } from '@/types/story';
import { getCurrentUser } from '@/lib/firebaseAuth';
import { logger } from '@/utils/logger';

// User Preferences Interface with more detailed tracking
export interface UserStoryPreference {
  userId: string;
  preferredThemes: StoryTheme[];
  avgStoryRating: number;
  mostLikedCharacterTypes: string[];
  learningInterests: string[];
  generatedStoryCount: number;
  lastStoryGeneratedAt?: Date;
  totalReadingTime?: number;  // Track cumulative reading time
}

// Custom error for Firestore operations
export class FirestoreError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'FirestoreError';
  }
}

export class FirestoreService {
  // Upsert user preferences with improved error handling
  async upsertUserPreferences(
    userId: string, 
    preferences: Partial<UserStoryPreference>
  ): Promise<void> {
    if (!userId) {
      throw new FirestoreError('User ID is required', 'INVALID_USER_ID');
    }

    const userDocRef = doc(firestore, 'userPreferences', userId);
    
    try {
      const docSnap = await getDoc(userDocRef);
      
      if (docSnap.exists()) {
        await updateDoc(userDocRef, {
          ...preferences,
          updatedAt: new Date()
        });
        
        logger.info('User preferences updated', { 
          userId, 
          updatedFields: Object.keys(preferences) 
        });
      } else {
        await setDoc(userDocRef, {
          userId,
          ...preferences,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        logger.info('New user preferences created', { userId });
      }
    } catch (error) {
      logger.error('Error upserting user preferences', { 
        userId, 
        error: error instanceof Error ? error.message : error 
      });
      throw new FirestoreError(
        'Failed to upsert user preferences', 
        'UPSERT_FAILED'
      );
    }
  }

  // Get user preferences with more robust error handling
  async getUserPreferences(userId: string): Promise<UserStoryPreference | null> {
    if (!userId) {
      throw new FirestoreError('User ID is required', 'INVALID_USER_ID');
    }

    const userDocRef = doc(firestore, 'userPreferences', userId);
    
    try {
      const docSnap = await getDoc(userDocRef);
      
      if (docSnap.exists()) {
        const preferences = docSnap.data() as UserStoryPreference;
        logger.debug('User preferences retrieved', { userId });
        return preferences;
      }
      
      logger.warn('No preferences found for user', { userId });
      return null;
    } catch (error) {
      logger.error('Error getting user preferences', { 
        userId, 
        error: error instanceof Error ? error.message : error 
      });
      throw new FirestoreError(
        'Failed to retrieve user preferences', 
        'RETRIEVE_FAILED'
      );
    }
  }

  // Record a generated story with enhanced metadata
  async recordStory(
    userId: string, 
    storyData: {
      content: string, 
      theme: StoryTheme, 
      interests: string[], 
      rating?: number,
      readingTime?: number  // Optional reading time in seconds
    }
  ): Promise<string> {
    if (!userId) {
      throw new FirestoreError('User ID is required', 'INVALID_USER_ID');
    }

    try {
      const storiesCollectionRef = collection(firestore, 'stories');
      
      const storyDoc = await addDoc(storiesCollectionRef, {
        userId,
        ...storyData,
        createdAt: new Date(),
        metadata: {
          wordCount: storyData.content.split(/\s+/).length,
          readingTime: storyData.readingTime
        }
      });
      
      logger.info('Story recorded', { 
        userId, 
        storyId: storyDoc.id, 
        theme: storyData.theme 
      });
      
      return storyDoc.id;
    } catch (error) {
      logger.error('Error recording story', { 
        userId, 
        error: error instanceof Error ? error.message : error 
      });
      throw new FirestoreError(
        'Failed to record story', 
        'RECORD_STORY_FAILED'
      );
    }
  }

  // Get user's stories with pagination and sorting
  async getUserStories(
    userId: string, 
    options: { 
      limit?: number, 
      sortBy?: 'createdAt' | 'rating' 
    } = {}
  ): Promise<Story[]> {
    if (!userId) {
      throw new FirestoreError('User ID is required', 'INVALID_USER_ID');
    }

    try {
      const storiesCollectionRef = collection(firestore, 'stories');
      
      const q = query(
        storiesCollectionRef, 
        where('userId', '==', userId),
        orderBy(options.sortBy || 'createdAt', 'desc'),
        limit(options.limit || 10)
      );

      const querySnapshot = await getDocs(q);
      
      const stories = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Story));

      logger.debug('User stories retrieved', { 
        userId, 
        storiesCount: stories.length 
      });

      return stories;
    } catch (error) {
      logger.error('Error getting user stories', { 
        userId, 
        error: error instanceof Error ? error.message : error 
      });
      throw new FirestoreError(
        'Failed to retrieve user stories', 
        'RETRIEVE_STORIES_FAILED'
      );
    }
  }

  // Advanced method to update user reading statistics
  async updateUserReadingStats(
    userId: string, 
    storyId: string, 
    readingTime: number
  ): Promise<void> {
    if (!userId || !storyId) {
      throw new FirestoreError('User ID and Story ID are required', 'INVALID_INPUT');
    }

    try {
      // Update story reading time
      const storyRef = doc(firestore, 'stories', storyId);
      await updateDoc(storyRef, {
        'metadata.readingTime': readingTime
      });

      // Update user preferences with cumulative reading time
      const userPreferencesRef = doc(firestore, 'userPreferences', userId);
      await updateDoc(userPreferencesRef, {
        totalReadingTime: (await this.getUserPreferences(userId))?.totalReadingTime || 0 + readingTime
      });

      logger.info('Reading stats updated', { 
        userId, 
        storyId, 
        readingTime 
      });
    } catch (error) {
      logger.error('Error updating reading stats', { 
        userId, 
        storyId, 
        error: error instanceof Error ? error.message : error 
      });
      throw new FirestoreError(
        'Failed to update reading stats', 
        'UPDATE_READING_STATS_FAILED'
      );
    }
  }
}

// Singleton instance for easy import
export const firestoreService = new FirestoreService();


