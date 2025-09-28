
import { Tabs, router } from 'expo-router';
import { Pressable } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  const ShareButton = () => (
    <Pressable
      onPress={() => router.push('/share')}
      style={{ marginRight: 16 }}
    >
      <IconSymbol name="square.and.arrow.up" size={24} color={colors.primary} />
    </Pressable>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerRight: () => <ShareButton />,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.pie" color={color} />,
        }}
      />
      <Tabs.Screen
        name="captable"
        options={{
          title: 'Cap Table',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="table" color={color} />,
        }}
      />
      <Tabs.Screen
        name="scenario"
        options={{
          title: 'Scenarios',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="slider.horizontal.3" color={color} />,
        }}
      />
      <Tabs.Screen
        name="timeline"
        options={{
          title: 'Timeline',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="timeline.selection" color={color} />,
        }}
      />
    </Tabs>
  );
}
