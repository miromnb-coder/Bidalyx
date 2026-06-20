import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';

import { colors, radii, spacing } from '../../src/constants/theme';

function TabIcon({ name, color, focused }: { name: keyof typeof Ionicons.glyphMap; color: string; focused: boolean }) {
  if (name === 'add') {
    return (
      <View style={[styles.plusButton, focused && styles.plusButtonActive]}>
        <Ionicons name="add" size={31} color={colors.card} />
      </View>
    );
  }

  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Ionicons name={name} size={21} color={color} />
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
      <Tabs.Screen
        name="home"
        options={{
          title: 'Etusivu',
          tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? 'home' : 'home-outline'} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="quotes"
        options={{
          title: 'Tarjoukset',
          tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? 'document-text' : 'document-text-outline'} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => <TabIcon name="add" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="customers"
        options={{
          title: 'Asiakkaat',
          tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? 'people' : 'people-outline'} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'Lisää',
          tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? 'ellipsis-horizontal' : 'ellipsis-horizontal-outline'} color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.select({ ios: 88, default: 74 }),
    paddingTop: spacing.xs,
    paddingBottom: Platform.select({ ios: spacing.lg, default: spacing.sm }),
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
  },
  iconWrap: {
    width: 34,
    height: 28,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: colors.background,
  },
  plusButton: {
    width: 58,
    height: 58,
    marginTop: -spacing.lg,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
  },
  plusButtonActive: {
    transform: [{ scale: 1.05 }],
  },
});
