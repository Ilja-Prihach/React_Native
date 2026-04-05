import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { detailsHref, loginHref } from '@/navigation/routes';

export default function SearchScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Поиск</Text>
        <Text style={styles.title}>Вкладка поиска</Text>
        <Text style={styles.body}>
          Эта вкладка показывает типизированные ссылки и на динамический маршрут деталей, и на поток авторизации.
        </Text>

        <Link href={detailsHref('flatlist-performance')} style={styles.link}>
          Открыть детали FlatList
        </Link>
        <Link href={loginHref} style={styles.secondaryLink}>
          Перейти ко входу
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#eef3ea',
    padding: 20,
    justifyContent: 'center',
  },
  card: {
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
  link: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2b6f48',
  },
  secondaryLink: {
    fontSize: 14,
    color: '#5f7b54',
  },
});
