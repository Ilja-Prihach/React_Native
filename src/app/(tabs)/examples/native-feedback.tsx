import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '@/components/BackButton';
import HapticPressable from '@/components/HapticPressable';
import { detailsHref, profileHref, searchHref } from '@/navigation/routes';

type FeedbackSample = {
  id: string;
  title: string;
  description: string;
  buttonLabel: string;
  onTrigger: () => Promise<void>;
};

const feedbackSamples: FeedbackSample[] = [
  {
    id: 'selection',
    title: 'Selection feedback',
    description: 'Подходит для коротких переключений и лёгких выборов, когда не нужен тяжёлый отклик.',
    buttonLabel: 'Проверить selection',
    onTrigger: () => Haptics.selectionAsync(),
  },
  {
    id: 'impact',
    title: 'Impact medium',
    description: 'Более явный импульс для важных нажатий: подтверждение действия, отправка формы, запуск примера.',
    buttonLabel: 'Проверить impact',
    onTrigger: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  },
  {
    id: 'success',
    title: 'Notification success',
    description: 'Удобен для состояния успеха, когда интерфейсу полезно дать короткое ощущение завершённости.',
    buttonLabel: 'Проверить success',
    onTrigger: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  },
];

const pressedStateFacts = [
  'Общий HapticPressable уже даёт единый tactile feedback на карточках и кнопках.',
  'Pressed-state цвет и лёгкий scale помогают увидеть отклик даже до фактической навигации.',
  'Небольшой haptic лучше работает на важных действиях, чем на каждом случайном тапе по тексту.',
];

export default function NativeFeedbackScreen() {
  async function handleSamplePress(sample: FeedbackSample) {
    await sample.onTrigger();
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.topBar}>
        <BackButton />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Пример</Text>
          <Text style={styles.title}>Нативный отклик</Text>
          <Text style={styles.description}>
            Здесь уже не заглушка, а рабочая демонстрация haptic feedback, состояний нажатия и того, как
            эти сигналы помогают сделать интерфейс живее и понятнее.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Типы отклика</Text>
          {feedbackSamples.map((sample) => (
            <View key={sample.id} style={styles.sampleCard}>
              <Text style={styles.sampleTitle}>{sample.title}</Text>
              <Text style={styles.sampleBody}>{sample.description}</Text>

              <HapticPressable
                hapticEnabled={false}
                style={({ pressed }) => [styles.sampleButton, pressed && styles.sampleButtonPressed]}
                onPress={() => void handleSamplePress(sample)}
              >
                <Text style={styles.sampleButtonText}>{sample.buttonLabel}</Text>
              </HapticPressable>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Живые pressed-состояния</Text>

          <View style={styles.demoGrid}>
            <HapticPressable
              style={({ pressed }) => [styles.demoTile, pressed && styles.demoTileWarmPressed]}
              onPress={() => router.push(profileHref)}
            >
              <Text style={styles.demoTileLabel}>Перейти в профиль</Text>
              <Text style={styles.demoTileMeta}>Тактильный отклик + переход</Text>
            </HapticPressable>

            <HapticPressable
              style={({ pressed }) => [styles.demoTile, pressed && styles.demoTileCoolPressed]}
              onPress={() => router.push(searchHref)}
            >
              <Text style={styles.demoTileLabel}>Открыть поиск</Text>
              <Text style={styles.demoTileMeta}>Светлый pressed-state</Text>
            </HapticPressable>

            <HapticPressable
              style={({ pressed }) => [styles.demoTile, pressed && styles.demoTileDarkPressed]}
              onPress={() => router.push(detailsHref('native-feedback'))}
            >
              <Text style={styles.demoTileLabel}>Открыть fallback details</Text>
              <Text style={styles.demoTileMeta}>Навигация без отдельного CTA</Text>
            </HapticPressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Что уже используется в приложении</Text>
          <View style={styles.factCard}>
            {pressedStateFacts.map((fact) => (
              <Text key={fact} style={styles.factText}>
                • {fact}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f1efe8',
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
  sampleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#ead9c7',
    gap: 10,
  },
  sampleTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#2b221d',
  },
  sampleBody: {
    fontSize: 15,
    lineHeight: 22,
    color: '#5f5248',
  },
  sampleButton: {
    minHeight: 46,
    borderRadius: 14,
    backgroundColor: '#ad4f1a',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  sampleButtonPressed: {
    backgroundColor: '#8f3f12',
    transform: [{ scale: 0.99 }],
  },
  sampleButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  demoGrid: {
    gap: 12,
  },
  demoTile: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#ead9c7',
    backgroundColor: '#ffffff',
    gap: 6,
  },
  demoTileWarmPressed: {
    backgroundColor: '#f7eee1',
    transform: [{ scale: 0.99 }],
  },
  demoTileCoolPressed: {
    backgroundColor: '#eef5fb',
    transform: [{ scale: 0.99 }],
  },
  demoTileDarkPressed: {
    backgroundColor: '#ece8e2',
    transform: [{ scale: 0.99 }],
  },
  demoTileLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2b221d',
  },
  demoTileMeta: {
    fontSize: 14,
    color: '#6b5e53',
  },
  factCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#ead9c7',
    gap: 10,
  },
  factText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#5f5248',
  },
});
