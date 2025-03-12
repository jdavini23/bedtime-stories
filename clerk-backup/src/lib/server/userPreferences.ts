import { UserPreferences } from '@/services/userPreferencesService';
import { clerkClient } from '@clerk/nextjs';
import { logger } from '@/utils/loggerInstance';

export async function getUserPreferences(userId: string | null): Promise<UserPreferences | null> {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    const user = await clerkClient.users.getUser(userId);
    const preferences = user.publicMetadata.preferences as UserPreferences | undefined;

    if (!preferences) {
      return null;
    }

    return {
      ...preferences,
      userId,
    } as UserPreferences;
  } catch (error) {
    logger.error('Error fetching user preferences:', { error });
    return null;
  }
}

export async function updateUserPreferences(
  userId: string | null,
  preferences: Partial<UserPreferences>
): Promise<UserPreferences | null> {
  try {
    const user = await clerkClient.users.getUser(userId as string);
    const currentPreferences = user.publicMetadata.preferences as UserPreferences | undefined;

    const updatedPreferences = {
      ...currentPreferences,
      ...preferences,
      userId,
    };

    await clerkClient.users.updateUser(userId as string, {
      publicMetadata: {
        ...user.publicMetadata,
        preferences: updatedPreferences,
      },
    });

    return updatedPreferences as UserPreferences;
  } catch (error) {
    logger.error('Error updating user preferences:', { error });
    return null;
  }
}

export async function createDefaultUserPreferences(
  userId: string | null
): Promise<UserPreferences | null> {
  const defaultPreferences: Partial<UserPreferences> = {
    userId,
    theme: 'light',
  };

  return updateUserPreferences(userId, defaultPreferences);
}
