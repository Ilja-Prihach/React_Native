import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserProfile } from './types';

const STORAGE_KEY = '@user_profile';

export const defaultProfile: UserProfile = {
  name: 'Ilja Prihach',
  bio: 'Разработчик React Native, изучающий TypeScript и Expo. Создаю классные приложения шаг за шагом.',
  avatarUrl: 'https://i.pravatar.cc/300',
};

export async function loadProfile(): Promise<UserProfile> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored) as UserProfile;
  }
  return defaultProfile;
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}
