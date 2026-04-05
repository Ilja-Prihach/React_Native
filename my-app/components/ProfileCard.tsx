import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import type { ProfileCardProps } from '../types';

export default function ProfileCard({ profile, onEdit }: ProfileCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />

        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.bio}>{profile.bio}</Text>

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={onEdit}
        >
          <Text style={styles.buttonText}>Save</Text>
        </Pressable>
      </View>
    </View>
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
  bio: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 48,
    borderRadius: 10,
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
