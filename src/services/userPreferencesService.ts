import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  DocumentReference,
  FirestoreError
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
}

class UserPreferencesService {
  private getUserPreferencesRef(userId: string): DocumentReference {
    return doc(firestore, 'userPreferences', userId);
  }

  // Logout method
  async logout(): Promise<void> {
    try {
      await signOut({ callbackUrl: '/login' });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Create or Update User Preferences with Enhanced Error Handling
  async saveUserPreferences(userId: string, preferences: UserPreferences): Promise<void> {
    try {
      const preferencesRef = this.getUserPreferencesRef(userId);
      await setDoc(preferencesRef, {
        ...preferences,
        userId,
        updatedAt: new Date()
      }, { merge: true });
    } catch (error) {
      if (error instanceof FirestoreError) {
        console.error('Firestore Error saving preferences:', error.code);
        // Log detailed error for tracking
        throw error;
      }
      throw error;
    }
  }

  // Get User Preferences with Fallback Mechanism
  async getUserPreferences(userId: string): Promise<UserPreferences> {
    try {
      const preferencesRef = this.getUserPreferencesRef(userId);
      const docSnap = await getDoc(preferencesRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as UserPreferences;
      } else {
        // Create default preferences if none exist
        const defaultPreferences: UserPreferences = {
          userId,
          preferredThemes: ['adventure', 'learning'],
          generatedStoryCount: 0,
          ageGroup: '6-8',
          learningInterests: []
        };
        await this.saveUserPreferences(userId, defaultPreferences);
        return defaultPreferences;
      }
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      throw error;
    }
  }

  // Update Specific Preference Fields
  async updatePreferenceFields(
    userId: string, 
    updates: Partial<UserPreferences>
  ): Promise<void> {
    try {
      const preferencesRef = this.getUserPreferencesRef(userId);
      await updateDoc(preferencesRef, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating preference fields:', error);
      throw error;
    }
  }

  // Increment Story Generation Count
  async incrementStoryCount(userId: string): Promise<void> {
    try {
      const preferencesRef = this.getUserPreferencesRef(userId);
      const docSnap = await getDoc(preferencesRef);
      if (docSnap.exists()) {
        await updateDoc(preferencesRef, {
          generatedStoryCount: docSnap.data().generatedStoryCount + 1,
          lastStoryGeneratedAt: new Date()
        });
      } else {
        throw new Error('User preferences not found');
      }
    } catch (error) {
      console.error('Error incrementing story count:', error);
      throw error;
    }
  }

  // Delete User Preferences (Optional)
  async deleteUserPreferences(userId: string): Promise<void> {
    try {
      const preferencesRef = this.getUserPreferencesRef(userId);
      await deleteDoc(preferencesRef);
    } catch (error) {
      console.error('Error deleting user preferences:', error);
      throw error;
    }
  }
}

export default new UserPreferencesService();


