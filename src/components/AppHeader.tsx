import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../constants/theme';

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  rightIcon?: keyof typeof Ionicons.glyphMap;
};

export function AppHeader({ title, subtitle, rightIcon }: AppHeaderProps) {
  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightIcon ? <Ionicons name={rightIcon} size={23} color={colors.text} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.h1,
    fontWeight: '900',
    letterSpacing: -0.8,
    color: colors.text,
  },
  subtitle: {
    marginTop: 2,
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.mutedText,
  },
});
