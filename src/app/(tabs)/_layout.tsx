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
          height: 64,
          paddingTop: 4,
          paddingBottom: 6,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Главная' }} />
      <Tabs.Screen name="search" options={{ title: 'Поиск' }} />
      <Tabs.Screen name="profile" options={{ title: 'Профиль' }} />
      <Tabs.Screen
        name="examples/expo-router-basics"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="examples/async-storage-draft"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="examples/saved-profiles"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="examples/render-flatlist"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="examples/native-feedback"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="details/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="examples/reanimated"
        options={{
            href: null,
        }}
      />
        <Tabs.Screen
            name="examples/swipe-rating"
            options={{
                href: null,
            }}
        />
        <Tabs.Screen
            name="examples/gesture-handler"
            options={{
                href: null,
            }}
        />
    </Tabs>

  );
}
