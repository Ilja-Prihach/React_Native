import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { demoItems } from '@/data/demoItems';
import { detailsHref, loginHref, profileHref, searchHref } from '@/navigation/routes';
import type { DemoItem } from '@/types';

export default function HomeScreen() {
  const renderItem = ({ item }: { item: DemoItem }) => (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => router.push(detailsHref(item.id))}
    >
      <Text style={styles.category}>{item.category}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.summary}>{item.summary}</Text>
      <Text style={styles.cta}>Открыть детали</Text>
    </Pressable>
  );

  return (
    <View style={styles.screen}>
      <FlatList<DemoItem>
        data={demoItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Главная</Text>
            <Text style={styles.heading}>Демо-элементы</Text>
            <Text style={styles.description}>
              Нажмите на любой элемент, чтобы открыть типизированный динамический маршрут через Expo Router.
            </Text>

            <View style={styles.pills}>
              <Pressable style={styles.pill} onPress={() => router.push(searchHref)}>
                <Text style={styles.pillText}>К поиску</Text>
              </Pressable>
              <Pressable style={styles.pill} onPress={() => router.push(profileHref)}>
                <Text style={styles.pillText}>Профиль</Text>
              </Pressable>
              <Pressable style={styles.pill} onPress={() => router.push(loginHref)}>
                <Text style={styles.pillText}>Авторизация</Text>
              </Pressable>
            </View>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f3efe7',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 36,
    gap: 14,
  },
  header: {
    marginBottom: 8,
    gap: 6,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#8c5e3c',
  },
  heading: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1f1a17',
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: '#5f5248',
    maxWidth: 320,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
    marginBottom: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#fffaf4',
    borderWidth: 1,
    borderColor: '#ead9c7',
  },
  pillText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7d4d2f',
  },
  card: {
    backgroundColor: '#fffaf4',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#ead9c7',
    gap: 8,
  },
  cardPressed: {
    transform: [{ scale: 0.99 }],
    backgroundColor: '#f7eee1',
  },
  category: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#9a6a47',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f1a17',
  },
  summary: {
    fontSize: 15,
    lineHeight: 21,
    color: '#5f5248',
  },
  cta: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '700',
    color: '#ad4f1a',
  },
});
