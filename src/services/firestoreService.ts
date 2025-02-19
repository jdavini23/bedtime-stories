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
  limit,
} from "firebase/firestore";
import { getFirebaseInstance } from "@/lib/firebase/config";
import { Story, StoryInput, StoryTheme } from "@/types/story";
import { getCurrentUser } from "@/lib/firebaseAuth";
import { logger } from "@/utils/logger";

// User Preferences Interface with more detailed tracking
export interface UserStoryPreference {
  userId: string;
  preferredThemes: StoryTheme[];
  avgStoryRating: number;
  mostLikedCharacterTypes: string[];
  learningInterests: string[];
  generatedStoryCount: number;
  lastStoryGeneratedAt?: Date;
  totalReadingTime?: number; // Track cumulative reading time
}

// Custom error for Firestore operations
export class FirestoreError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "FirestoreError";
  }
}

export class FirestoreService {
  // Upsert user preferences with improved error handling
  async upsertUserPreferences(
    userId: string,
    preferences: Partial<UserStoryPreference>
  ): Promise<void> {
    if (!userId) {
      throw new FirestoreError("User ID is required", "INVALID_USER_ID");
    }

    // Check network connectivity
    if (!getFirebaseInstance().isOnline()) {
      logger.warn("Offline mode detected when upserting user preferences", {
        userId,
      });
      throw new FirestoreError("Client is offline", "OFFLINE");
    }

    const userDocRef = doc(getFirebaseInstance().db, "userPreferences", userId);

    try {
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        await updateDoc(userDocRef, {
          ...preferences,
          updatedAt: new Date(),
        });

        logger.info("User preferences updated", {
          userId,
          updatedFields: Object.keys(preferences),
        });
      } else {
        await setDoc(userDocRef, {
          userId,
          ...preferences,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        logger.info("New user preferences created", { userId });
      }
    } catch (error) {
      logger.error("Error upserting user preferences", {
        userId,
        error: error instanceof Error ? error.message : error,
      });
      throw new FirestoreError(
        "Failed to upsert user preferences",
        "UPSERT_FAILED"
      );
    }
  }

  // Safe Firebase operation wrapper with retries and error handling
  private async safeFirebaseOperation<T>(
    operation: () => Promise<T>,
    fallbackValue?: T,
    maxRetries: number = 3,
    retryDelay: number = 1000
  ): Promise<T | undefined> {
    let lastError: Error | undefined;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await operation();
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Log retry attempt
        logger.warn("Firebase operation failed, retrying", {
          attempt,
          maxRetries,
          errorMessage: lastError.message,
          timestamp: new Date().toISOString(),
        });

        // If this is not the last attempt, wait before retrying
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
        }
      }
    }

    // If all retries failed, log the final error and return fallback
    if (lastError) {
      logger.error("Firebase operation failed after all retries", {
        maxRetries,
        errorMessage: lastError.message,
        errorStack: lastError.stack,
        timestamp: new Date().toISOString(),
      });
    }

    return fallbackValue;
  }

  // Get user preferences with enhanced error handling and retry logic
  async getUserPreferences(userId: string): Promise<UserStoryPreference | null> {
    const diagnosticContext = {
      userId,
      method: "getUserPreferences",
      timestamp: new Date().toISOString(),
      service: "FirestoreService",
    };

    try {
      // Get user preferences document reference
      const userDocRef = doc(getFirebaseInstance().db, "userPreferences", userId);

      // Enable network access and get document with retries
      const docSnap = await this.safeFirebaseOperation(
        async () => {
          await getFirebaseInstance().enableNetworkAccess();
          return getDoc(userDocRef);
        },
        undefined,
        3
      );

      // Handle missing document
      if (!docSnap) {
        logger.warn("Failed to retrieve user preferences after retries", diagnosticContext);
        return this.getDefaultPreferences(userId);
      }

      // Return existing preferences if found
      if (docSnap.exists()) {
        const preferences = docSnap.data() as UserStoryPreference;
        logger.info("User preferences retrieved successfully", {
          ...diagnosticContext,
          preferencesFound: true,
        });
        return preferences;
      }

      // Create default preferences if none exist
      logger.warn("No preferences found for user, creating defaults", diagnosticContext);
      return this.getDefaultPreferences(userId);

    } catch (error) {
      // Log error with context
      const errorContext = {
        ...diagnosticContext,
        errorName: error instanceof Error ? error.name : "Unknown Error",
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : "No stack trace",
      };

      logger.error("Error retrieving user preferences", errorContext);
      return this.getDefaultPreferences(userId);
    }
  }

  // Method to provide default preferences with enhanced logging
  private getDefaultPreferences(userId: string): UserStoryPreference {
    const defaultPreferences: UserStoryPreference = {
      userId,
      preferredThemes: ["adventure", "fantasy"],
      avgStoryRating: 0,
      mostLikedCharacterTypes: ["brave", "curious"],
      learningInterests: ["science", "nature", "friendship"],
      generatedStoryCount: 0,
      lastStoryGeneratedAt: new Date(),
      totalReadingTime: 0,
    };

    logger.warn("Returning default user preferences due to retrieval failure", {
      userId,
      timestamp: new Date().toISOString(),
    });

    return defaultPreferences;
  }

  // New method to check network connectivity
  private async checkNetworkConnectivity(): Promise<{
    isFullyConnected: boolean;
    navigatorOnline: boolean;
    firebaseConnectivity: boolean;
  }> {
    try {
      const navigatorOnline = navigator.onLine;
      let firebaseConnectivity = false;

      try {
        // Attempt a quick Firestore operation to check connectivity
        const testDocRef = doc(
          getFirebaseInstance().db,
          "connectivity",
          "test"
        );
        await getDoc(testDocRef);
        firebaseConnectivity = true;
      } catch {
        firebaseConnectivity = false;
      }

      return {
        isFullyConnected: navigatorOnline && firebaseConnectivity,
        navigatorOnline,
        firebaseConnectivity,
      };
    } catch (error) {
      logger.error("Error during network connectivity check", {
        error: error instanceof Error ? error.message : String(error),
      });

      return {
        isFullyConnected: false,
        navigatorOnline: navigator.onLine,
        firebaseConnectivity: false,
      };
    }
  }

  // Record a generated story with enhanced metadata
  async recordStory(
    userId: string,
    storyData: {
      content: string;
      theme: StoryTheme;
      interests: string[];
      rating?: number;
      readingTime?: number; // Optional reading time in seconds
    }
  ): Promise<string> {
    if (!userId) {
      throw new FirestoreError("User ID is required", "INVALID_USER_ID");
    }

    // Check network connectivity
    if (!getFirebaseInstance().isOnline()) {
      logger.warn("Offline mode detected when recording story", { userId });
      throw new FirestoreError("Client is offline", "OFFLINE");
    }

    try {
      const storiesCollectionRef = collection(
        getFirebaseInstance().db,
        "stories"
      );

      const storyDoc = await addDoc(storiesCollectionRef, {
        userId,
        ...storyData,
        createdAt: new Date(),
        metadata: {
          wordCount: storyData.content.split(/\s+/).length,
          readingTime: storyData.readingTime,
        },
      });

      logger.info("Story recorded", {
        userId,
        storyId: storyDoc.id,
        theme: storyData.theme,
      });

      return storyDoc.id;
    } catch (error) {
      logger.error("Error recording story", {
        userId,
        error: error instanceof Error ? error.message : error,
      });
      throw new FirestoreError("Failed to record story", "RECORD_STORY_FAILED");
    }
  }

  // Get user's stories with pagination and sorting
  async getUserStories(
    userId: string,
    options: {
      limit?: number;
      sortBy?: "createdAt" | "rating";
    } = {}
  ): Promise<Story[]> {
    if (!userId) {
      throw new FirestoreError("User ID is required", "INVALID_USER_ID");
    }

    // Check network connectivity
    if (!getFirebaseInstance().isOnline()) {
      logger.warn("Offline mode detected when fetching user stories", {
        userId,
      });
      throw new FirestoreError("Client is offline", "OFFLINE");
    }

    try {
      const storiesCollectionRef = collection(
        getFirebaseInstance().db,
        "stories"
      );

      const q = query(
        storiesCollectionRef,
        where("userId", "==", userId),
        orderBy(options.sortBy || "createdAt", "desc"),
        limit(options.limit || 10)
      );

      const querySnapshot = await getDocs(q);

      const stories = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Story)
      );

      logger.debug("User stories retrieved", {
        userId,
        storiesCount: stories.length,
      });

      return stories;
    } catch (error) {
      logger.error("Error getting user stories", {
        userId,
        error: error instanceof Error ? error.message : error,
      });
      throw new FirestoreError(
        "Failed to retrieve user stories",
        "RETRIEVE_STORIES_FAILED"
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
      throw new FirestoreError(
        "User ID and Story ID are required",
        "INVALID_INPUT"
      );
    }

    // Check network connectivity
    if (!getFirebaseInstance().isOnline()) {
      logger.warn("Offline mode detected when updating reading stats", {
        userId,
      });
      throw new FirestoreError("Client is offline", "OFFLINE");
    }

    try {
      // Update story reading time
      const storyRef = doc(getFirebaseInstance().db, "stories", storyId);
      await updateDoc(storyRef, {
        "metadata.readingTime": readingTime,
      });

      // Update user preferences with cumulative reading time
      const userPreferencesRef = doc(
        getFirebaseInstance().db,
        "userPreferences",
        userId
      );
      await updateDoc(userPreferencesRef, {
        totalReadingTime:
          (await this.getUserPreferences(userId))?.totalReadingTime ||
          0 + readingTime,
      });

      logger.info("Reading stats updated", {
        userId,
        storyId,
        readingTime,
      });
    } catch (error) {
      logger.error("Error updating reading stats", {
        userId,
        storyId,
        error: error instanceof Error ? error.message : error,
      });
      throw new FirestoreError(
        "Failed to update reading stats",
        "UPDATE_READING_STATS_FAILED"
      );
    }
  }
}

// Singleton instance for easy import
export const firestoreService = new FirestoreService();
