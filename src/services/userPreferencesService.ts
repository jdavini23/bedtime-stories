import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  DocumentReference,
  FirestoreError,
  DocumentSnapshot
} from 'firebase/firestore';
import { firestore } from '@/lib/firebase/clientApp';
import { signOut } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export interface UserPreferences {
  id?: string;
  userId: string;
  preferredThemes?: string[];
  generatedStoryCount?: number;
  lastStoryGeneratedAt?: Date;
  learningInterests?: string[];
  ageGroup?: '3-5' | '6-8' | '9-12';
  storyGenerationPreferences?: {
    maxLength?: number;
    educationalFocus?: boolean;
    moralEmphasis?: boolean;
  };
  theme?: 'light' | 'dark';
  language?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const COLLECTION_NAME = 'userPreferences';

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

  private async retry<T>(
    operation: () => Promise<T>,
    attempt: number = 1
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (attempt >= this.retryAttempts) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
      return this.retry(operation, attempt + 1);
    }
  }

  private getDefaultPreferences(userId: string): UserPreferences {
    return {
      userId,
      preferredThemes: ['adventure', 'learning'],
      generatedStoryCount: 0,
      ageGroup: '6-8',
      learningInterests: [],
      theme: 'light',
      language: 'en',
      notifications: {
        email: true,
        push: false
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  // Static methods to maintain backward compatibility
  private static getUserPreferencesRef(userId: string): DocumentReference {
    return doc(firestore, COLLECTION_NAME, userId);
  }

  // Static method for backwards compatibility
  static async logout(): Promise<void> {
    try {
      await signOut({ callbackUrl: '/login' });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Static method for backwards compatibility
  static async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    return this.getInstance().getUserPreferences(userId);
  }

  // Instance method
  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    // Check cache first
    if (this.cache.has(userId)) {
      return this.cache.get(userId) ?? null;
    }

    try {
      const docRef = doc(firestore, COLLECTION_NAME, userId);
      const docSnap = await this.retry(() => getDoc(docRef));

      if (docSnap.exists()) {
        const data = docSnap.data() as UserPreferences;
        // Convert Firestore Timestamp to Date
        if (data.lastStoryGeneratedAt) {
          data.lastStoryGeneratedAt = (data.lastStoryGeneratedAt as any).toDate();
        }
        if (data.createdAt) {
          data.createdAt = (data.createdAt as any).toDate();
        }
        if (data.updatedAt) {
          data.updatedAt = (data.updatedAt as any).toDate();
        }
        this.cache.set(userId, data);
        return data;
      }

      // If no preferences exist, create default ones
      const defaultPrefs = this.getDefaultPreferences(userId);
      await this.createUserPreferences(defaultPrefs);
      this.cache.set(userId, defaultPrefs);
      return defaultPrefs;
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      // Return cached data if available, otherwise null
      return this.cache.get(userId) ?? null;
    }
  }

  // Static method for backwards compatibility
  static async saveUserPreferences(userId: string, preferences: UserPreferences): Promise<void> {
    return this.getInstance().createUserPreferences(preferences);
  }

  async createUserPreferences(preferences: UserPreferences): Promise<void> {
    try {
      const docRef = doc(firestore, COLLECTION_NAME, preferences.userId);
      await this.retry(() => 
        setDoc(docRef, {
          ...preferences,
          lastStoryGeneratedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
      );
      this.cache.set(preferences.userId, preferences);
    } catch (error) {
      console.error('Error creating user preferences:', error);
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
      const docRef = doc(firestore, COLLECTION_NAME, userId);
      await this.retry(() => 
        updateDoc(docRef, {
          ...updates,
          lastStoryGeneratedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
      );
      
      // Update cache
      const currentPrefs = this.cache.get(userId);
      const updatedPrefs = currentPrefs ? { ...currentPrefs, ...updates } : null;
      if (updatedPrefs) {
        this.cache.set(userId, updatedPrefs);
      }

      return updatedPrefs;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      return null;
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
            lastStoryGeneratedAt: serverTimestamp()
          })
        );
      } else {
        throw new Error('User preferences not found');
      }
    } catch (error) {
      console.error('Error incrementing story count:', error);
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
      console.error('Error deleting user preferences:', error);
      throw error;
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export default UserPreferencesService.getInstance();
