import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HapticPressable from '@/components/HapticPressable';
import { homeHref, loginHref } from '@/navigation/routes';

type RegisterFormState = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterScreen() {
  const [form, setForm] = useState<RegisterFormState>({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function handleChange<K extends keyof RegisterFormState>(field: K, value: RegisterFormState[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit() {
    const name = form.name.trim();
    const email = form.email.trim();
    const password = form.password.trim();

    if (!name || !email || !password) {
      setError('Заполните имя, email и пароль.');
      setSuccessMessage(null);
      return;
    }

    if (name.length < 2) {
      setError('Имя должно содержать минимум 2 символа.');
      setSuccessMessage(null);
      return;
    }

    if (!email.includes('@')) {
      setError('Укажите корректный email.');
      setSuccessMessage(null);
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов.');
      setSuccessMessage(null);
      return;
    }

    setError(null);
    setSuccessMessage(`Аккаунт для ${name} готов к созданию.`);
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Доступ</Text>
        <Text style={styles.title}>Регистрация</Text>
        <Text style={styles.description}>
          Минимальная форма регистрации с typed state и базовой проверкой перед отправкой.
        </Text>

        <TextInput
          value={form.name}
          onChangeText={(value) => handleChange('name', value)}
          placeholder="Имя"
          placeholderTextColor="#9b8d82"
          style={styles.input}
        />

        <TextInput
          value={form.email}
          onChangeText={(value) => handleChange('email', value)}
          placeholder="Email"
          placeholderTextColor="#9b8d82"
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />

        <TextInput
          value={form.password}
          onChangeText={(value) => handleChange('password', value)}
          placeholder="Пароль"
          placeholderTextColor="#9b8d82"
          style={styles.input}
          secureTextEntry
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

        <HapticPressable style={styles.primaryButton} onPress={handleSubmit}>
          <Text style={styles.primaryButtonText}>Создать аккаунт</Text>
        </HapticPressable>

        <Link href={loginHref} style={styles.link}>
          Уже есть аккаунт?
        </Link>

        <Link href={homeHref} style={styles.secondaryLink}>
          На главную
        </Link>
      </View>
    </SafeAreaView>
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
  input: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dfcdb9',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1f1a17',
  },
  errorText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#b13b2e',
  },
  successText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#2f7a45',
  },
  primaryButton: {
    marginTop: 6,
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: '#1f6f5f',
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
    color: '#1f6f5f',
  },
  secondaryLink: {
    fontSize: 14,
    color: '#6b5d52',
  },
});
