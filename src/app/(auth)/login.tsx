import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { homeHref, registerHref } from '@/navigation/routes';

export default function LoginScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Доступ</Text>
        <Text style={styles.title}>Вход</Text>
        <Text style={styles.description}>
          Простой экран входа внутри отдельной группы маршрутов для авторизации.
        </Text>

        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Продолжить</Text>
        </Pressable>

        <Link href={registerHref} style={styles.link}>
          Создать аккаунт
        </Link>

        <Link href={homeHref} style={styles.secondaryLink}>
          На главную
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f7f1e8',
  },
  card: {
    backgroundColor: '#fffaf4',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#ead9c7',
    gap: 14,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#9a6a47',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1f1a17',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#5f5248',
  },
  primaryButton: {
    marginTop: 6,
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: '#ad4f1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  link: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ad4f1a',
  },
  secondaryLink: {
    fontSize: 14,
    color: '#6b5d52',
  },
});
