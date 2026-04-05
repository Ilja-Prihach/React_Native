import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '@/components/BackButton';
import HapticPressable from '@/components/HapticPressable';

type FlatListDemoCategory = 'Навигация' | 'Хранение' | 'Интерфейс' | 'Отклик';
type DensityMode = 'compact' | 'comfortable';

type FlatListDemoEntry = {
  id: string;
  title: string;
  category: FlatListDemoCategory;
  description: string;
  metricLabel: string;
  metricValue: string;
};

const listShowcaseData: FlatListDemoEntry[] = [
  {
    id: 'row-01',
    title: 'Typed routes и helper-функции',
    category: 'Навигация',
    description: 'Один источник правды для ссылок помогает не плодить строковые пути по экрану.',
    metricLabel: 'Польза',
    metricValue: 'Высокая',
  },
  {
    id: 'row-02',
    title: 'Auth group отдельно от tabs',
    category: 'Навигация',
    description: 'Группы маршрутов дают чистый URL и локальный stack без лишней вложенности.',
    metricLabel: 'URL',
    metricValue: '/login',
  },
  {
    id: 'row-03',
    title: 'Черновик профиля в AsyncStorage',
    category: 'Хранение',
    description: 'Локальные данные переживают перезапуск приложения и подходят для настройки формы.',
    metricLabel: 'Хранилище',
    metricValue: 'AsyncStorage',
  },
  {
    id: 'row-04',
    title: 'Галерея сохранённых профилей',
    category: 'Хранение',
    description: 'Коллекция показывает, как FlatList удобно масштабируется от одного объекта к списку.',
    metricLabel: 'Тип данных',
    metricValue: 'UserProfile[]',
  },
  {
    id: 'row-05',
    title: 'Поиск по demoItems',
    category: 'Интерфейс',
    description: 'Локальная фильтрация и список результатов уже собраны на типизированном FlatList.',
    metricLabel: 'Фильтр',
    metricValue: 'Локальный',
  },
  {
    id: 'row-06',
    title: 'Плотный режим карточек',
    category: 'Интерфейс',
    description: 'Компактный рендер полезен, когда важна ёмкость списка, а не длинное описание.',
    metricLabel: 'Высота',
    metricValue: 'Снижена',
  },
  {
    id: 'row-07',
    title: 'Нативный haptic feedback',
    category: 'Отклик',
    description: 'Одинаковый tactile feedback на главных действиях делает интерфейс более собранным.',
    metricLabel: 'Источник',
    metricValue: 'expo-haptics',
  },
  {
    id: 'row-08',
    title: 'Back button в верхней зоне',
    category: 'Отклик',
    description: 'Закреплённая кнопка навигации не прыгает вместе с коротким контентом.',
    metricLabel: 'Позиция',
    metricValue: 'Top pinned',
  },
  {
    id: 'row-09',
    title: 'Карточки с отдельными example screens',
    category: 'Интерфейс',
    description: 'Каталог стал честнее: карточки постепенно ведут на свои рабочие экраны, а не в общую заглушку.',
    metricLabel: 'Состояние',
    metricValue: 'В процессе',
  },
  {
    id: 'row-10',
    title: 'Details route с параметром id',
    category: 'Навигация',
    description: 'Dynamic route остаётся полезным как fallback для тех карточек, которые ещё не вынесли в отдельный экран.',
    metricLabel: 'Params',
    metricValue: 'id обязателен',
  },
];

const categoryFilters: Array<FlatListDemoCategory | 'Все'> = ['Все', 'Навигация', 'Хранение', 'Интерфейс', 'Отклик'];

export default function RenderFlatListScreen() {
  const [activeCategory, setActiveCategory] = useState<FlatListDemoCategory | 'Все'>('Все');
  const [densityMode, setDensityMode] = useState<DensityMode>('comfortable');

  const visibleItems =
    activeCategory === 'Все'
      ? listShowcaseData
      : listShowcaseData.filter((item) => item.category === activeCategory);

  const renderItem = ({ item }: { item: FlatListDemoEntry }) => {
    const compactMode = densityMode === 'compact';

    return (
      <View style={[styles.itemCard, compactMode && styles.itemCardCompact]}>
        <View style={styles.itemTopRow}>
          <Text style={styles.itemCategory}>{item.category}</Text>
          <Text style={styles.metricBadge}>
            {item.metricLabel}: {item.metricValue}
          </Text>
        </View>

        <Text style={[styles.itemTitle, compactMode && styles.itemTitleCompact]}>{item.title}</Text>

        {!compactMode ? <Text style={styles.itemDescription}>{item.description}</Text> : null}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.topBar}>
        <BackButton />
      </View>

      <FlatList<FlatListDemoEntry>
        data={visibleItems}
        key={densityMode}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <View style={styles.headerStack}>
            <View style={styles.hero}>
              <Text style={styles.eyebrow}>Пример</Text>
              <Text style={styles.title}>Рендеринг FlatList</Text>
              <Text style={styles.description}>
                Этот экран показывает настоящий typed FlatList: отдельный тип записи, keyExtractor, header,
                separator, empty state и переключение плотности карточек.
              </Text>
            </View>

            <View style={styles.controlsCard}>
              <Text style={styles.controlsTitle}>Фильтр категории</Text>
              <View style={styles.chipsRow}>
                {categoryFilters.map((category) => {
                  const active = activeCategory === category;

                  return (
                    <HapticPressable
                      key={category}
                      style={({ pressed }) => [
                        styles.chip,
                        active && styles.chipActive,
                        pressed && styles.chipPressed,
                      ]}
                      onPress={() => setActiveCategory(category)}
                    >
                      <Text style={[styles.chipText, active && styles.chipTextActive]}>{category}</Text>
                    </HapticPressable>
                  );
                })}
              </View>

              <Text style={styles.controlsTitle}>Плотность списка</Text>
              <View style={styles.modeRow}>
                {(['comfortable', 'compact'] as DensityMode[]).map((mode) => {
                  const active = densityMode === mode;

                  return (
                    <HapticPressable
                      key={mode}
                      style={({ pressed }) => [
                        styles.modeButton,
                        active && styles.modeButtonActive,
                        pressed && styles.modeButtonPressed,
                      ]}
                      onPress={() => setDensityMode(mode)}
                    >
                      <Text style={[styles.modeButtonText, active && styles.modeButtonTextActive]}>
                        {mode === 'comfortable' ? 'Подробно' : 'Компактно'}
                      </Text>
                    </HapticPressable>
                  );
                })}
              </View>

              <Text style={styles.metaText}>Сейчас видно: {visibleItems.length} элементов</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Нет элементов для выбранного фильтра</Text>
            <Text style={styles.emptyText}>Сбросьте категорию на «Все», чтобы снова показать полный список.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#eef6f2',
  },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  content: {
    padding: 20,
    paddingTop: 8,
    paddingBottom: 36,
  },
  headerStack: {
    gap: 16,
    marginBottom: 16,
  },
  hero: {
    backgroundColor: '#f8fffb',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#d6e9de',
    gap: 10,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#3f7d63',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#13231c',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#476457',
  },
  controlsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#d6e9de',
    gap: 12,
  },
  controlsTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#13231c',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#f3faf6',
    borderWidth: 1,
    borderColor: '#d6e9de',
  },
  chipActive: {
    backgroundColor: '#1e7a56',
    borderColor: '#1e7a56',
  },
  chipPressed: {
    transform: [{ scale: 0.98 }],
  },
  chipText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2f5d4c',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  modeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modeButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#d6e9de',
    backgroundColor: '#f3faf6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  modeButtonActive: {
    backgroundColor: '#13231c',
    borderColor: '#13231c',
  },
  modeButtonPressed: {
    transform: [{ scale: 0.99 }],
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2f5d4c',
  },
  modeButtonTextActive: {
    color: '#ffffff',
  },
  metaText: {
    fontSize: 14,
    color: '#476457',
  },
  separator: {
    height: 12,
  },
  itemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#d6e9de',
    gap: 10,
  },
  itemCardCompact: {
    paddingVertical: 14,
    gap: 6,
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  itemCategory: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#3f7d63',
  },
  metricBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5d6f67',
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#13231c',
  },
  itemTitleCompact: {
    fontSize: 17,
  },
  itemDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: '#476457',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#d6e9de',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#13231c',
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#476457',
  },
});
