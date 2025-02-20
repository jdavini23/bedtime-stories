import { UserPreferences } from '@/services/userPreferencesService';
import { clerkClient } from '@clerk/nextjs';

export async function getUserPreferences(userId: string | null | null | null | null | null | null): Promise<UserPreferences | null> {
  try {
    const user = await clerkClient.users.getUser(userId);
    const preferences = user.publicMetadata.preferences as UserPreferences | undefined;

    if (!preferences) {
      return null;
    }

    return {
      userId,
      ...preferences,
    } as UserPreferences;
  } catch (error) {
    logger.error('Error fetching user preferences:', error);
    return null;
  }
}

export async function updateUserPreferences(
  userId: string | null | null | null | null | null | null,
  preferences: Partial<UserPreferences>
): Promise<UserPreferences | null> {
  try {
    const user = await clerkClient.users.getUser(userId);
    const currentPreferences = user.publicMetadata.preferences as UserPreferences | undefined;

    const updatedPreferences = {
      ...currentPreferences,
      ...preferences,
      userId,
    };

    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        preferences: updatedPreferences,
      },
    });

    return updatedPreferences;
  } catch (error) {
    logger.error('Error updating user preferences:', error);
    return null;
  }
}

export async function createDefaultUserPreferences(
  userId: string | null | null | null | null | null | null
): Promise<UserPreferences | null> {
  const defaultPreferences: UserPreferences | null = {
    userId,
    theme: 'light',
    storyPreferences: {
      defaultAge: 5,
      preferredThemes: ['adventure', 'educational'],
      readingLevel: 'intermediate',
    },
  };

  return updateUserPreferences(userId, defaultPreferences);
}
