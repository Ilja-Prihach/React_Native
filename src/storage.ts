import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserProfile } from './types';

const STORAGE_KEY = '@user_profile';
const PROFILE_DRAFT_KEY = '@user_profile_draft';
const SAVED_PROFILES_KEY = '@saved_profiles';

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

export async function loadProfileDraft(): Promise<UserProfile> {
  const stored = await AsyncStorage.getItem(PROFILE_DRAFT_KEY);
  if (stored) {
    return JSON.parse(stored) as UserProfile;
  }
  return defaultProfile;
}

export async function saveProfileDraft(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(PROFILE_DRAFT_KEY, JSON.stringify(profile));
}

export async function clearProfileDraft(): Promise<void> {
  await AsyncStorage.removeItem(PROFILE_DRAFT_KEY);
}

export async function loadSavedProfiles(): Promise<UserProfile[]> {
  const stored = await AsyncStorage.getItem(SAVED_PROFILES_KEY);
  if (stored) {
    return JSON.parse(stored) as UserProfile[];
  }
  return [];
}

export async function saveProfileToCollection(profile: UserProfile): Promise<UserProfile[]> {
  const profiles = await loadSavedProfiles();
  const nextProfile: UserProfile = {
    ...profile,
    id: profile.id ?? `${Date.now()}`,
  };
  const updatedProfiles = [nextProfile, ...profiles];
  await AsyncStorage.setItem(SAVED_PROFILES_KEY, JSON.stringify(updatedProfiles));
  return updatedProfiles;
}

export async function deleteSavedProfile(profileId: string): Promise<UserProfile[]> {
  const profiles = await loadSavedProfiles();
  const updatedProfiles = profiles.filter((profile) => profile.id !== profileId);
  await AsyncStorage.setItem(SAVED_PROFILES_KEY, JSON.stringify(updatedProfiles));
  return updatedProfiles;
}
