import * as Haptics from 'expo-haptics';
import { Keyboard } from 'react-native';
import { useEffect, useState } from 'react';
import ProfileCard from '@/components/ProfileCard';
import { defaultProfile, loadProfile, saveProfile } from '@/storage';
import type { UserProfile } from '@/types';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [persistedProfile, setPersistedProfile] = useState<UserProfile>(defaultProfile);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function hydrateProfile() {
      try {
        const storedProfile = await loadProfile();
        if (isMounted) {
          setProfile(storedProfile);
          setPersistedProfile(storedProfile);
          setError(null);
        }
      } catch {
        if (isMounted) {
          setError('Не удалось загрузить профиль.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    hydrateProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSave() {
    const trimmedProfile: UserProfile = {
      name: profile.name.trim(),
      bio: profile.bio.trim(),
      avatarUrl: profile.avatarUrl.trim(),
    };

    if (!trimmedProfile.name || !trimmedProfile.bio || !trimmedProfile.avatarUrl) {
      setError('Заполните имя, bio и ссылку на аватар.');
      Keyboard.dismiss();
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      setSaving(true);
      setError(null);
      Keyboard.dismiss();
      await Haptics.selectionAsync();
      await saveProfile(trimmedProfile);
      setProfile(trimmedProfile);
      setPersistedProfile(trimmedProfile);
      setIsEditing(false);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      setError('Не удалось сохранить профиль.');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setSaving(false);
    }
  }

  function handleProfileChange(field: keyof UserProfile, value: string) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleReset() {
    setProfile(persistedProfile);
    setError(null);
  }

  function handleStartEdit() {
    setIsEditing(true);
    setError(null);
  }

  function handleCancelEdit() {
    Keyboard.dismiss();
    setProfile(persistedProfile);
    setIsEditing(false);
    setError(null);
  }

  return (
    <ProfileCard
      profile={profile}
      loading={loading}
      error={error}
      saving={saving}
      isEditing={isEditing}
      onSave={handleSave}
      onStartEdit={handleStartEdit}
      onCancelEdit={handleCancelEdit}
      onProfileChange={handleProfileChange}
      onReset={handleReset}
    />
  );
}
