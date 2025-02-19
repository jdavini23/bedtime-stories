import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  DocumentReference,
  DocumentSnapshot,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase/clientApp";
import { signOut } from "next-auth/react";
import { logger as log } from "@/utils/logger";
import AuthService from "./authService";

export interface UserPreferences {
  id?: string;
  userId: string;
  preferredThemes?: string[];
  generatedStoryCount?: number;
  lastStoryGeneratedAt?: Date;
  learningInterests?: string[];
  ageGroup?: "3-5" | "6-8" | "9-12";
  storyGenerationPreferences?: {
    maxLength?: number;
    educationalFocus?: boolean;
    moralEmphasis?: boolean;
  };
  theme?: "light" | "dark";
  language?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const COLLECTION_NAME = "userPreferences";

class UserPreferencesService {
  private static instance: UserPreferencesService;
  private cache: Map<string, UserPreferences>;
  private retryAttempts: number = 3;
  private retryDelay: number = 1000; // 1 second

  private constructor() {
    this.cache = new Map();
  }

  public static getInstance(): UserPreferencesService {
    if (!UserPreferencesService.instance) {
      UserPreferencesService.instance = new UserPreferencesService();
    }
    return UserPreferencesService.instance;
  }

  // Enhance logging and ensure Firestore client does not attempt to connect when offline
  private async retry<T>(
    operation: () => Promise<T>,
    attempt: number = 1
  ): Promise<T> {
    try {
      // Check network status before attempting operation
      if (!navigator.onLine) {
        log.warn(`Offline: Skipping operation (Attempt ${attempt})`, {
          context: "UserPreferencesService.retry",
        });
        throw new Error("Client is offline");
      }

      return await operation();
    } catch (error) {
      const firestoreError = error as {
        code?: string;
        message?: string;
        stack?: string;
      };

      // Determine if error is related to offline status
      const isOfflineError =
        firestoreError.code === "unavailable" ||
        firestoreError.message?.includes("offline") ||
        !navigator.onLine;

      log.error(`Retry attempt ${attempt} failed`, {
        error: firestoreError,
        isOfflineError,
        context: "UserPreferencesService.retry",
      });

      // Stop retrying if max attempts reached or not an offline-related error
      if (attempt >= this.retryAttempts) {
        log.error("Max retry attempts reached", {
          error: firestoreError,
          context: "UserPreferencesService.retry",
        });
        throw error;
      }

      // If offline, stop retrying immediately
      if (isOfflineError) {
        log.warn("Operating in offline mode. Stopping retry attempts.", {
          attempt,
          context: "UserPreferencesService.retry",
        });
        throw error;
      }

      // Exponential backoff with jitter for non-offline errors
      const jitter = Math.random() * 500; // Add up to 500ms of randomness
      const delay = this.retryDelay * Math.pow(2, attempt - 1) + jitter;

      log.warn(`Retrying operation in ${delay}ms`, {
        attempt,
        delay,
        context: "UserPreferencesService.retry",
      });

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Recursive retry
      return this.retry(operation, attempt + 1);
    }
  }

  private getDefaultPreferences(userId: string): UserPreferences {
    return {
      userId,
      preferredThemes: ["adventure", "learning"],
      generatedStoryCount: 0,
      ageGroup: "6-8",
      learningInterests: [],
      theme: "light",
      language: "en",
      notifications: {
        email: true,
        push: false,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  // Static methods to maintain backward compatibility
  private static getUserPreferencesRef(userId: string): DocumentReference {
    return doc(firestore, COLLECTION_NAME, userId);
  }

  // Static method for backwards compatibility
  static async logout(): Promise<void> {
    try {
      await signOut({ callbackUrl: "/auth/signin" });
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  // Static method for backwards compatibility
  static async getUserPreferences(
    userId: string
  ): Promise<UserPreferences | null> {
    return this.getInstance().getUserPreferences(userId);
  }

  // Enhance logging in getUserPreferences method
  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      // Validate userId
      if (!userId) {
        log.warn("Attempted to fetch preferences with empty userId", {
          context: "UserPreferencesService.getUserPreferences",
        });
        return null;
      }

      // Check cache first
      if (this.cache.has(userId)) {
        log.info("Returning cached user preferences", { userId });
        return this.cache.get(userId) ?? null;
      }

      // Check if online
      if (!navigator.onLine) {
        log.warn("Client is offline. Attempting to retrieve from cache", {
          userId,
          context: "UserPreferencesService.getUserPreferences",
        });
        return this.getDefaultPreferences(userId);
      }

      const docRef = doc(firestore, COLLECTION_NAME, userId);

      // Use a timeout to prevent hanging
      const docSnap = await Promise.race([
        this.retry(() => getDoc(docRef)),
        new Promise<DocumentSnapshot>(
          (_, reject) =>
            setTimeout(
              () => reject(new Error("Firestore fetch timeout")),
              20000
            ) // Increased timeout
        ),
      ]);

      if (docSnap.exists()) {
        const data = docSnap.data() as UserPreferences;

        // Convert Firestore Timestamps to Date with null checks
        const convertTimestamp = (
          timestamp: { toDate?: () => Date } | null | undefined
        ): Date | undefined =>
          timestamp && timestamp.toDate ? timestamp.toDate() : undefined;

        data.lastStoryGeneratedAt = convertTimestamp(
          data.lastStoryGeneratedAt as
            | { toDate?: () => Date }
            | null
            | undefined
        );
        data.createdAt = convertTimestamp(
          data.createdAt as { toDate?: () => Date } | null | undefined
        );
        data.updatedAt = convertTimestamp(
          data.updatedAt as { toDate?: () => Date } | null | undefined
        );

        this.cache.set(userId, data);

        log.info("Successfully fetched user preferences", { userId });
        return data;
      }

      // If no preferences exist, create default ones
      const defaultPrefs = this.getDefaultPreferences(userId);
      await this.createUserPreferences(defaultPrefs);

      log.info("Created default user preferences", { userId });

      this.cache.set(userId, defaultPrefs);
      return defaultPrefs;
    } catch (error) {
      const firestoreError = error as { code?: string; message?: string };

      // Specific handling for offline errors
      if (
        firestoreError.code === "unavailable" ||
        firestoreError.message?.includes("offline")
      ) {
        log.warn("Unable to fetch preferences due to offline status", {
          error: firestoreError,
          userId,
          context: "UserPreferencesService.getUserPreferences",
        });

        // Return cached or default preferences
        const cachedPrefs = this.cache.get(userId);
        return cachedPrefs ?? this.getDefaultPreferences(userId);
      }

      log.error("Error fetching user preferences", {
        error,
        userId,
        context: "UserPreferencesService.getUserPreferences",
      });

      // Return cached data if available, otherwise null
      return this.cache.get(userId) ?? null;
    }
  }

  // Static method for backwards compatibility
  static async saveUserPreferences(
    userId: string,
    preferences: UserPreferences
  ): Promise<void> {
    return this.getInstance().createUserPreferences(preferences);
  }

  async createUserPreferences(preferences: UserPreferences): Promise<void> {
    try {
      // Validate preferences
      if (!preferences.userId) {
        throw new Error("User ID is required to create preferences");
      }

      const docRef = doc(firestore, COLLECTION_NAME, preferences.userId);

      await this.retry(() =>
        setDoc(docRef, {
          ...preferences,
          lastStoryGeneratedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );

      log.info("Successfully created user preferences", {
        userId: preferences.userId,
      });

      this.cache.set(preferences.userId, preferences);
    } catch (error) {
      log.error("Error creating user preferences", {
        error,
        preferences,
        context: "UserPreferencesService.createUserPreferences",
      });
      throw error;
    }
  }

  // Static method for backwards compatibility
  static async updatePreferenceFields(
    userId: string,
    updates: Partial<UserPreferences>
  ): Promise<UserPreferences | null> {
    return this.getInstance().updateUserPreferences(userId, updates);
  }

  async updateUserPreferences(
    userId: string,
    updates: Partial<UserPreferences>
  ): Promise<UserPreferences | null> {
    try {
      // Validate inputs
      if (!userId) {
        throw new Error("User ID is required to update preferences");
      }

      const docRef = doc(firestore, COLLECTION_NAME, userId);

      await this.retry(() =>
        updateDoc(docRef, {
          ...updates,
          lastStoryGeneratedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );

      // Fetch updated preferences
      const updatedDoc = await this.retry(() => getDoc(docRef));
      const updatedPrefs = updatedDoc.data() as UserPreferences;

      // Update cache
      this.cache.set(userId, updatedPrefs);

      log.info("Successfully updated user preferences", {
        userId,
        updatedFields: Object.keys(updates),
      });

      return updatedPrefs;
    } catch (error) {
      log.error("Error updating user preferences", {
        error,
        userId,
        updates,
        context: "UserPreferencesService.updateUserPreferences",
      });

      return this.cache.get(userId) ?? null;
    }
  }

  // Static method for backwards compatibility
  static async incrementStoryCount(userId: string): Promise<void> {
    return this.getInstance().incrementStoryCount(userId);
  }

  async incrementStoryCount(userId: string): Promise<void> {
    try {
      const preferencesRef = doc(firestore, COLLECTION_NAME, userId);
      const docSnap = await this.retry(() => getDoc(preferencesRef));
      if (docSnap.exists()) {
        await this.retry(() =>
          updateDoc(preferencesRef, {
            generatedStoryCount: docSnap.data().generatedStoryCount + 1,
            lastStoryGeneratedAt: serverTimestamp(),
          })
        );
      } else {
        throw new Error("User preferences not found");
      }
    } catch (error) {
      log.error("Error incrementing story count", {
        error,
        userId,
        context: "UserPreferencesService.incrementStoryCount",
      });
      throw error;
    }
  }

  // Static method for backwards compatibility
  static async deleteUserPreferences(userId: string): Promise<void> {
    return this.getInstance().deleteUserPreferences(userId);
  }

  async deleteUserPreferences(userId: string): Promise<void> {
    try {
      const preferencesRef = doc(firestore, COLLECTION_NAME, userId);
      await this.retry(() => deleteDoc(preferencesRef));
    } catch (error) {
      log.error("Error deleting user preferences", {
        error,
        userId,
        context: "UserPreferencesService.deleteUserPreferences",
      });
      throw error;
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export default UserPreferencesService.getInstance();
