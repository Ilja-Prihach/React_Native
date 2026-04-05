import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { homeHref, registerHref } from '@/navigation/routes';

type LoginFormState = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const [form, setForm] = useState<LoginFormState>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function handleChange<K extends keyof LoginFormState>(field: K, value: LoginFormState[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit() {
    const email = form.email.trim();
    const password = form.password.trim();

    if (!email || !password) {
      setError('Введите email и пароль.');
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
    setSuccessMessage(`Форма входа заполнена корректно для ${email}.`);
  }

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Доступ</Text>
        <Text style={styles.title}>Вход</Text>
        <Text style={styles.description}>
          Минимальная форма входа с базовой проверкой полей и типизированным состоянием.
        </Text>

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

        <Pressable style={styles.primaryButton} onPress={handleSubmit}>
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
