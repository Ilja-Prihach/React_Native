import { Link } from 'expo-router';
import { useDeferredValue, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { demoItems } from '@/data/demoItems';
import { detailsHref, loginHref } from '@/navigation/routes';
import type { DemoItem } from '@/types';

export default function SearchScreen() {
  const [query, setQuery] = useState<string>('');
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();

  const filteredItems = demoItems.filter((item) => {
    if (!normalizedQuery) {
      return true;
    }

    const haystack = [item.title, item.category, item.summary].join(' ').toLowerCase();
    return haystack.includes(normalizedQuery);
  });

  const renderItem = ({ item }: { item: DemoItem }) => (
    <Link href={detailsHref(item.id)} asChild>
      <Pressable style={({ pressed }) => [styles.resultCard, pressed && styles.resultCardPressed]}>
        <Text style={styles.resultCategory}>{item.category}</Text>
        <Text style={styles.resultTitle}>{item.title}</Text>
        <Text style={styles.resultSummary}>{item.summary}</Text>
      </Pressable>
    </Link>
  );

  return (
    <View style={styles.screen}>
      <FlatList<DemoItem>
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={styles.headerCard}>
            <Text style={styles.eyebrow}>Поиск</Text>
            <Text style={styles.title}>Найдите нужный демо-элемент</Text>
            <Text style={styles.body}>
              Поиск работает локально по названию, категории и описанию. Маршруты к деталям остаются типобезопасными.
            </Text>

            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Например: навигация, профиль, FlatList"
              placeholderTextColor="#7f8f78"
              style={styles.input}
              autoCorrect={false}
              autoCapitalize="none"
            />

            <View style={styles.metaRow}>
              <Text style={styles.metaText}>Найдено: {filteredItems.length}</Text>
              <Link href={loginHref} style={styles.secondaryLink}>
                Ко входу
              </Link>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Ничего не найдено</Text>
            <Text style={styles.emptyText}>
              Попробуйте другой запрос. Например: «интерфейс», «навигация» или «профиль».
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#eef3ea',
  },
  content: {
    padding: 20,
    paddingBottom: 36,
    gap: 14,
  },
  headerCard: {
    backgroundColor: '#f8fcf6',
    borderRadius: 24,
    padding: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: '#d9e4d1',
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#5f7b54',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1a2317',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4f5f48',
  },
  input: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#cddbc4',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1a2317',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  metaText: {
    fontSize: 14,
    color: '#5f7b54',
  },
  secondaryLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2b6f48',
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#d9e4d1',
    gap: 8,
  },
  resultCardPressed: {
    backgroundColor: '#f1f8ed',
    transform: [{ scale: 0.99 }],
  },
  resultCategory: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#5f7b54',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a2317',
  },
  resultSummary: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4f5f48',
  },
  emptyState: {
    backgroundColor: '#f8fcf6',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#d9e4d1',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a2317',
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4f5f48',
  },
});
