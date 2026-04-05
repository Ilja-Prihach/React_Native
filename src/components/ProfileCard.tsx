import {
  ActivityIndicator,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import ProfileForm from './ProfileForm';
import type { ProfileCardProps } from '../types';

type EditableProfileCardProps = ProfileCardProps & {
  onProfileChange: (field: 'name' | 'bio' | 'avatarUrl', value: string) => void;
  onReset: () => void;
};

export default function ProfileCard({
  profile,
  loading,
  error,
  saving,
  isEditing,
  onSave,
  onStartEdit,
  onCancelEdit,
  onProfileChange,
  onReset,
}: EditableProfileCardProps) {
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.statusText}>Загрузка профиля...</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />

          {!isEditing ? (
            <>
              <Text style={styles.name}>{profile.name}</Text>
              <Text style={styles.bio}>{profile.bio}</Text>
            </>
          ) : (
            <>
              <ProfileForm
                initialProfile={profile}
                onSave={(nextProfile) => {
                  onProfileChange('name', nextProfile.name);
                  onProfileChange('bio', nextProfile.bio);
                  onProfileChange('avatarUrl', nextProfile.avatarUrl);
                }}
                onCancel={onReset}
              />

              <Text style={styles.previewTitle}>Предпросмотр</Text>
              <Text style={styles.name}>{profile.name}</Text>
              <Text style={styles.bio}>{profile.bio}</Text>
            </>
          )}

          {error && <Text style={styles.errorText}>{error}</Text>}

          {!isEditing ? (
            <Pressable
              style={({ pressed }) => [
                styles.button,
                (pressed || saving) && styles.buttonPressed,
              ]}
              onPress={onStartEdit}
              disabled={saving}
            >
              <Text style={styles.buttonText}>Редактировать</Text>
            </Pressable>
          ) : (
            <View style={styles.actions}>
              <Pressable
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && styles.secondaryButtonPressed,
                ]}
                onPress={onCancelEdit}
                disabled={saving}
              >
                <Text style={styles.secondaryButtonText}>Отмена</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  (pressed || saving) && styles.buttonPressed,
                ]}
                onPress={onSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Сохранить</Text>
                )}
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  previewTitle: {
    alignSelf: 'flex-start',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#6f6f6f',
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  errorText: {
    color: '#d00',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  statusText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 48,
    borderRadius: 10,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  secondaryButton: {
    minHeight: 44,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#c9c9c9',
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonPressed: {
    backgroundColor: '#e7e7e7',
  },
  secondaryButtonText: {
    color: '#3d3d3d',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonPressed: {
    backgroundColor: '#005EC4',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
