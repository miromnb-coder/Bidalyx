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
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightIcon ? <Ionicons name={rightIcon} size={24} color={colors.text} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  textWrap: {
    flex: 1,
    paddingRight: spacing.md,
  },
  title: {
    fontSize: typography.title,
    lineHeight: 38,
    fontWeight: '900',
    letterSpacing: -0.9,
    color: colors.text,
  },
  subtitle: {
    marginTop: 2,
    fontSize: typography.body,
    lineHeight: 22,
    fontWeight: '600',
    color: colors.mutedText,
  },
});
