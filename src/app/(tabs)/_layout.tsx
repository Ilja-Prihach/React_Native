import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#ad4f1a',
        tabBarInactiveTintColor: '#7a6b60',
        tabBarStyle: {
          backgroundColor: '#fffaf4',
          borderTopColor: '#ead9c7',
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Главная' }} />
      <Tabs.Screen name="search" options={{ title: 'Поиск' }} />
      <Tabs.Screen name="profile" options={{ title: 'Профиль' }} />
      <Tabs.Screen
        name="details/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
