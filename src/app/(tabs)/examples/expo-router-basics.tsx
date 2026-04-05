import { Link, router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '@/components/BackButton';
import HapticPressable from '@/components/HapticPressable';
import {
  detailsHref,
  loginHref,
  profileHref,
  registerHref,
  searchHref,
} from '@/navigation/routes';

const routeFacts = [
  {
    title: 'Tabs layout',
    body: 'Главные пользовательские разделы лежат в группе (tabs), поэтому Home, Search и Profile собираются в нижнюю навигацию.',
  },
  {
    title: 'Auth route group',
    body: 'Экраны login и register лежат в (auth), но сегмент группы не попадает в URL. Поэтому путь остаётся /login и /register.',
  },
  {
    title: 'Dynamic route',
    body: 'Экран details/[id] получает параметр id, и TypeScript проверяет, что вы не забыли передать его в params.',
  },
];

export default function ExpoRouterBasicsScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.topBar}>
        <BackButton />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Пример</Text>
          <Text style={styles.title}>Основы Expo Router</Text>
          <Text style={styles.description}>
            Этот экран не просто карточка, а рабочая демонстрация того, как в приложении устроены tabs,
            auth group, dynamic routes и type-safe navigation.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Что уже настроено</Text>
          {routeFacts.map((fact) => (
            <View key={fact.title} style={styles.factCard}>
              <Text style={styles.factTitle}>{fact.title}</Text>
              <Text style={styles.factBody}>{fact.body}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Попробовать навигацию</Text>

          <View style={styles.buttonGroup}>
            <HapticPressable
              style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
              onPress={() => router.push(loginHref)}
            >
              <Text style={styles.actionButtonText}>Открыть Login</Text>
            </HapticPressable>

            <HapticPressable
              style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
              onPress={() => router.push(registerHref)}
            >
              <Text style={styles.actionButtonText}>Открыть Register</Text>
            </HapticPressable>

            <HapticPressable
              style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
              onPress={() => router.push(detailsHref('flatlist-performance'))}
            >
              <Text style={styles.actionButtonText}>Открыть dynamic details</Text>
            </HapticPressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Typed routes в действии</Text>
          <Text style={styles.codeText}>searchHref = /search</Text>
          <Text style={styles.codeText}>profileHref = /profile</Text>
          <Text style={styles.codeText}>detailsHref('flatlist-performance')</Text>
          <Text style={styles.note}>
            Эти переходы уже используются в приложении. Если передать несуществующий путь или забыть id для
            dynamic route, TypeScript должен выдать ошибку.
          </Text>

          <View style={styles.inlineLinks}>
            <Link href={searchHref} style={styles.inlineLink}>
              Перейти в Search
            </Link>
            <Link href={profileHref} style={styles.inlineLink}>
              Перейти в Profile
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5efe6',
  },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  content: {
    padding: 20,
    paddingTop: 8,
    paddingBottom: 36,
    gap: 18,
  },
  hero: {
    backgroundColor: '#fffaf4',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#ead9c7',
    gap: 10,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#8c5e3c',
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
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1f1a17',
  },
  factCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#ead9c7',
    gap: 6,
  },
  factTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3b2a1e',
  },
  factBody: {
    fontSize: 15,
    lineHeight: 22,
    color: '#5f5248',
  },
  buttonGroup: {
    gap: 10,
  },
  actionButton: {
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: '#ad4f1a',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  actionButtonPressed: {
    backgroundColor: '#8f3f12',
    transform: [{ scale: 0.99 }],
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  codeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3b2a1e',
  },
  note: {
    fontSize: 15,
    lineHeight: 22,
    color: '#5f5248',
  },
  inlineLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 4,
  },
  inlineLink: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ad4f1a',
  },
});
