import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { getDemoItemById } from '@/data/demoItems';

export default function ItemDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = getDemoItemById(id);

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: true, title: item?.title ?? 'Детали элемента' }} />

      {item ? (
        <View style={styles.card}>
          <Text style={styles.label}>{item.category}</Text>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.body}>{item.summary}</Text>
          <Text style={styles.meta}>Параметр маршрута: {item.id}</Text>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.title}>Элемент не найден</Text>
          <Text style={styles.body}>
            Запрошенный элемент отсутствует в локальном демо-наборе данных.
          </Text>
          <Text style={styles.meta}>Запрошенный id: {id ?? 'неизвестно'}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f3efe7',
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fffaf4',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#ead9c7',
    gap: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#9a6a47',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1f1a17',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#5f5248',
  },
  meta: {
    marginTop: 8,
    fontSize: 14,
    color: '#8a796a',
  },
});
