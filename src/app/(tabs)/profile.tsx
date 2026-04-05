import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import ProfileCard from '@/components/ProfileCard';
import { defaultProfile, loadProfile, saveProfile } from '@/storage';
import type { UserProfile } from '@/types';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function hydrateProfile() {
      try {
        const storedProfile = await loadProfile();
        if (isMounted) {
          setProfile(storedProfile);
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
    try {
      setSaving(true);
      setError(null);
      await Haptics.selectionAsync();
      await saveProfile(profile);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      setError('Не удалось сохранить профиль.');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProfileCard
      profile={profile}
      loading={loading}
      error={error}
      saving={saving}
      onEdit={handleSave}
    />
  );
}
