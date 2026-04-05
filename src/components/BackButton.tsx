import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import HapticPressable from './HapticPressable';

export default function BackButton() {
  return (
    <HapticPressable
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      onPress={() => router.back()}
    >
      <Text style={styles.text}>← Назад</Text>
    </HapticPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    minHeight: 36,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#fffaf4',
    borderWidth: 1,
    borderColor: '#ead9c7',
    justifyContent: 'center',
    marginBottom: 4,
  },
  buttonPressed: {
    backgroundColor: '#f3e6d7',
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7d4d2f',
  },
});
