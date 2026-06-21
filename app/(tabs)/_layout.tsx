import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';

import { colors, radii, shadows, spacing } from '../../src/constants/theme';

function TabIcon({ name, color, focused }: { name: keyof typeof Ionicons.glyphMap; color: string; focused: boolean }) {
  if (name === 'add') {
    return (
      <View style={[styles.plusButton, focused && styles.plusButtonActive]}>
        <Ionicons name="add" size={30} color={colors.card} />
      </View>
    );
  }

  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Ionicons name={name} size={22} color={color} />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.subtleText,
        tabBarLabelStyle: styles.label,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Etusivu', tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? 'home' : 'home-outline'} color={color} focused={focused} /> }} />
      <Tabs.Screen name="quotes" options={{ title: 'Tarjoukset', tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? 'document-text' : 'document-text-outline'} color={color} focused={focused} /> }} />
      <Tabs.Screen name="create" options={{ title: '', tabBarIcon: ({ color, focused }) => <TabIcon name="add" color={color} focused={focused} /> }} />
      <Tabs.Screen name="customers" options={{ title: 'Asiakkaat', tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? 'people' : 'people-outline'} color={color} focused={focused} /> }} />
      <Tabs.Screen name="more" options={{ title: 'Lisää', tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? 'ellipsis-horizontal' : 'ellipsis-horizontal-outline'} color={color} focused={focused} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.select({ ios: 86, default: 74 }),
    paddingTop: spacing.xs,
    paddingBottom: Platform.select({ ios: spacing.lg, default: spacing.sm }),
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    backgroundColor: 'rgba(255,255,255,0.96)',
    ...shadows.card,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
  },
  iconWrap: {
    width: 40,
    height: 34,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: colors.backgroundElevated,
  },
  plusButton: {
    width: 62,
    height: 62,
    marginTop: -22,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
    ...shadows.fab,
  },
  plusButtonActive: {
    transform: [{ scale: 1.03 }],
  },
});
