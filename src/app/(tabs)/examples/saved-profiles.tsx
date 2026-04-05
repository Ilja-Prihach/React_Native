import { useCallback, useState } from 'react';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '@/components/BackButton';
import HapticPressable from '@/components/HapticPressable';
import { deleteSavedProfile, loadSavedProfiles } from '@/storage';
import type { UserProfile } from '@/types';

export default function SavedProfilesScreen() {
  const { refresh } = useLocalSearchParams<{ refresh?: string }>();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string>('Загрузка сохранённых профилей...');

  const hydrateProfiles = useCallback(async () => {
    try {
      setLoading(true);
      const storedProfiles = await loadSavedProfiles();
      setProfiles(storedProfiles);
      setStatusMessage(
        storedProfiles.length > 0
          ? 'Сохранённые профили загружены.'
          : 'Список пока пуст. Добавьте профиль с экрана AsyncStorage draft.'
      );
    } catch {
      setStatusMessage('Не удалось загрузить сохранённые профили.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      hydrateProfiles();
    }, [hydrateProfiles])
  );

  useFocusEffect(
    useCallback(() => {
      if (refresh) {
        hydrateProfiles();
      }
    }, [hydrateProfiles, refresh])
  );

  async function handleDelete(profileId: string) {
    try {
      const nextProfiles = await deleteSavedProfile(profileId);
      setProfiles(nextProfiles);
      setStatusMessage(
        nextProfiles.length > 0 ? 'Профиль удалён из коллекции.' : 'Коллекция пуста после удаления.'
      );
    } catch {
      setStatusMessage('Не удалось удалить профиль.');
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.topBar}>
        <BackButton />
      </View>

      <FlatList<UserProfile>
        data={profiles}
        keyExtractor={(item) => item.id ?? `${item.name}-${item.avatarUrl}`}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>Пример</Text>
            <Text style={styles.title}>Сохранённые профили</Text>
            <Text style={styles.description}>
              Здесь отображаются профили, которые вы добавили из экрана черновика в AsyncStorage.
            </Text>
            <Text style={styles.status}>{statusMessage}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.bio}>{item.bio}</Text>

            <HapticPressable
              style={({ pressed }) => [styles.deleteButton, pressed && styles.deleteButtonPressed]}
              onPress={() => item.id && handleDelete(item.id)}
            >
              <Text style={styles.deleteButtonText}>Удалить</Text>
            </HapticPressable>
          </View>
        )}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Пока нет сохранённых профилей</Text>
              <Text style={styles.emptyText}>
                Перейдите на экран черновика и сохраните профиль в коллекцию, чтобы увидеть его здесь.
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#eef0fb',
  },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  content: {
    padding: 20,
    paddingTop: 8,
    paddingBottom: 36,
    gap: 16,
  },
  hero: {
    backgroundColor: '#f8f9ff',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#d9dcef',
    gap: 10,
    marginBottom: 16,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#5e6893',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1f31',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4a5475',
  },
  status: {
    fontSize: 14,
    lineHeight: 21,
    color: '#5e6893',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#d9dcef',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1f31',
  },
  bio: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4a5475',
    textAlign: 'center',
  },
  deleteButton: {
    minHeight: 44,
    borderRadius: 14,
    backgroundColor: '#fbe9e7',
    borderWidth: 1,
    borderColor: '#f0c4bd',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  deleteButtonPressed: {
    backgroundColor: '#f6ddd9',
    transform: [{ scale: 0.99 }],
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#b13b2e',
  },
  emptyState: {
    backgroundColor: '#f8f9ff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#d9dcef',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1f31',
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4a5475',
  },
});
