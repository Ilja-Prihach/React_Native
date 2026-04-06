import type { DemoItem } from '../types';

export const demoItems: DemoItem[] = [
  {
    id: 'expo-router',
    title: 'Основы Expo Router',
    category: 'Навигация',
    summary: 'Типизированная файловая маршрутизация для построения нативных сценариев с меньшим количеством ручной настройки.',
  },
  {
    id: 'async-storage',
    title: 'Черновик профиля в AsyncStorage',
    category: 'Хранение данных',
    summary: 'Локальное хранение пользовательских настроек и чернового состояния прямо на устройстве.',
  },
  {
    id: 'flatlist-performance',
    title: 'Рендеринг FlatList',
    category: 'Интерфейс',
    summary: 'Строго типизированный рендер элементов для масштабируемых и предсказуемых экранов со списками.',
  },
  {
    id: 'native-feedback',
    title: 'Нативный отклик',
    category: 'Пользовательский опыт',
    summary: 'Сочетание тактильной отдачи, состояний нажатия и ясной визуальной иерархии для живого взаимодействия.',
  },
  {
    id: 'reanimated',
    title: 'Reanimated анимации',
    category: 'Анимации',
    summary: 'Плавные 60 fps анимации на UI-потоке: shared values, timing, spring, layout transitions.',
  },
];

export function getDemoItemById(id: string) {
  return demoItems.find((item) => item.id === id) ?? null;
}
