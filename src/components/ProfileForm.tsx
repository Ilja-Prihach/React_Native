import { Keyboard, StyleSheet, Text, TextInput, View } from 'react-native';
import type { ProfileFormProps } from '../types';

export default function ProfileForm({ initialProfile, onSave, onCancel }: ProfileFormProps) {
  return (
    <View style={styles.form}>
      <Text style={styles.label}>Имя</Text>
      <TextInput
        value={initialProfile.name}
        onChangeText={(value) => onSave({ ...initialProfile, name: value })}
        placeholder="Введите имя"
        placeholderTextColor="#8d8d8d"
        style={styles.input}
        returnKeyType="next"
      />

      <Text style={styles.label}>Bio</Text>
      <TextInput
        value={initialProfile.bio}
        onChangeText={(value) => onSave({ ...initialProfile, bio: value })}
        placeholder="Расскажите о себе"
        placeholderTextColor="#8d8d8d"
        style={[styles.input, styles.multilineInput]}
        multiline
        textAlignVertical="top"
        blurOnSubmit
        onSubmitEditing={Keyboard.dismiss}
      />

      <Text style={styles.label}>Аватар URL</Text>
      <TextInput
        value={initialProfile.avatarUrl}
        onChangeText={(value) => onSave({ ...initialProfile, avatarUrl: value })}
        placeholder="https://example.com/avatar.png"
        placeholderTextColor="#8d8d8d"
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        returnKeyType="done"
        onSubmitEditing={Keyboard.dismiss}
      />

      <Text style={styles.helper} onPress={onCancel}>
        Сбросить изменения
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    width: '100%',
    gap: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4c4c4c',
  },
  input: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d7d7d7',
    backgroundColor: '#fafafa',
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#1a1a1a',
  },
  multilineInput: {
    minHeight: 96,
    paddingTop: 12,
    paddingBottom: 12,
  },
  helper: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: '600',
    color: '#005ec4',
  },
});
