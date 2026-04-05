import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '@/components/BackButton';
import HapticPressable from '@/components/HapticPressable';
import {
  clearProfileDraft,
  defaultProfile,
  loadProfileDraft,
  saveProfileToCollection,
  saveProfileDraft,
} from '@/storage';
import { savedProfilesHref } from '@/navigation/routes';
import type { UserProfile } from '@/types';

type StatusTone = 'neutral' | 'success' | 'error';

export default function AsyncStorageDraftScreen() {
  const [draft, setDraft] = useState<UserProfile>(defaultProfile);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string>('Загрузка черновика...');
  const [statusTone, setStatusTone] = useState<StatusTone>('neutral');

  useEffect(() => {
    let isMounted = true;

    async function hydrateDraft() {
      try {
        const storedDraft = await loadProfileDraft();
        if (isMounted) {
          setDraft(storedDraft);
          setStatusMessage('Черновик загружен из AsyncStorage.');
          setStatusTone('success');
        }
      } catch {
        if (isMounted) {
          setStatusMessage('Не удалось загрузить черновик.');
          setStatusTone('error');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    hydrateDraft();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleChange(field: keyof UserProfile, value: string) {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }));
    setStatusMessage('Есть несохранённые изменения.');
    setStatusTone('neutral');
  }

  async function handleSaveDraft() {
    try {
      await saveProfileDraft(draft);
      setStatusMessage('Черновик сохранён в AsyncStorage.');
      setStatusTone('success');
    } catch {
      setStatusMessage('Не удалось сохранить черновик.');
      setStatusTone('error');
    }
  }

  async function handleReloadDraft() {
    try {
      const storedDraft = await loadProfileDraft();
      setDraft(storedDraft);
      setStatusMessage('Черновик перечитан из AsyncStorage.');
      setStatusTone('success');
    } catch {
      setStatusMessage('Не удалось перечитать черновик.');
      setStatusTone('error');
    }
  }

  async function handleResetDraft() {
    try {
      await clearProfileDraft();
      setDraft(defaultProfile);
      setStatusMessage('Черновик очищен, показаны значения по умолчанию.');
      setStatusTone('success');
    } catch {
      setStatusMessage('Не удалось очистить черновик.');
      setStatusTone('error');
    }
  }

  async function handleSaveToCollection() {
    try {
      await saveProfileToCollection({
        ...draft,
        id: undefined,
      });
      setStatusMessage('Профиль добавлен в коллекцию сохранённых примеров.');
      setStatusTone('success');
    } catch {
      setStatusMessage('Не удалось добавить профиль в коллекцию.');
      setStatusTone('error');
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.topBar}>
        <BackButton />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Пример</Text>
          <Text style={styles.title}>Черновик профиля в AsyncStorage</Text>
          <Text style={styles.description}>
            Этот экран показывает реальную локальную работу с AsyncStorage: загрузку, сохранение,
            повторное чтение и очистку черновика профиля.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Имя</Text>
          <TextInput
            value={draft.name}
            onChangeText={(value) => handleChange('name', value)}
            style={styles.input}
            placeholder="Введите имя"
            placeholderTextColor="#8d8d8d"
          />

          <Text style={styles.label}>Bio</Text>
          <TextInput
            value={draft.bio}
            onChangeText={(value) => handleChange('bio', value)}
            style={[styles.input, styles.multilineInput]}
            placeholder="Введите bio"
            placeholderTextColor="#8d8d8d"
            multiline
            textAlignVertical="top"
          />

          <Text style={styles.label}>URL аватара</Text>
          <TextInput
            value={draft.avatarUrl}
            onChangeText={(value) => handleChange('avatarUrl', value)}
            style={styles.input}
            placeholder="https://example.com/avatar.png"
            placeholderTextColor="#8d8d8d"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.actions}>
          <HapticPressable
            style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
            onPress={handleSaveDraft}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>Сохранить черновик</Text>
          </HapticPressable>

          <HapticPressable
            style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
            onPress={handleSaveToCollection}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>Добавить в коллекцию</Text>
          </HapticPressable>

          <HapticPressable
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]}
            onPress={handleReloadDraft}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>Перечитать</Text>
          </HapticPressable>

          <HapticPressable
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]}
            onPress={handleResetDraft}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>Очистить</Text>
          </HapticPressable>

          <HapticPressable
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]}
            onPress={() => router.push(savedProfilesHref)}
          >
            <Text style={styles.secondaryButtonText}>Открыть коллекцию</Text>
          </HapticPressable>
        </View>

        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Статус</Text>
          <Text
            style={[
              styles.statusText,
              statusTone === 'success' && styles.successText,
              statusTone === 'error' && styles.errorText,
            ]}
          >
            {statusMessage}
          </Text>
        </View>
      </ScrollView>
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
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#d9dcef',
    gap: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4b5375',
  },
  input: {
    minHeight: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#d9dcef',
    backgroundColor: '#f8f9ff',
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#1a1f31',
  },
  multilineInput: {
    minHeight: 96,
    paddingTop: 12,
    paddingBottom: 12,
  },
  actions: {
    gap: 10,
  },
  primaryButton: {
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: '#4158a6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  primaryButtonPressed: {
    backgroundColor: '#33488b',
    transform: [{ scale: 0.99 }],
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  secondaryButton: {
    minHeight: 46,
    borderRadius: 16,
    backgroundColor: '#edf1ff',
    borderWidth: 1,
    borderColor: '#d9dcef',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  secondaryButtonPressed: {
    backgroundColor: '#e1e7fb',
    transform: [{ scale: 0.99 }],
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4158a6',
  },
  statusCard: {
    backgroundColor: '#f8f9ff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#d9dcef',
    gap: 6,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#5e6893',
  },
  statusText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4a5475',
  },
  successText: {
    color: '#2f7a45',
  },
  errorText: {
    color: '#b13b2e',
  },
});
