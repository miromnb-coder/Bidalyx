import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { colors, radii, spacing, typography } from '../constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
};

export function Button({ title, onPress, variant = 'primary', icon, style }: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isGhost = variant === 'ghost';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        isPrimary && styles.primary,
        variant === 'secondary' && styles.secondary,
        isGhost && styles.ghost,
        pressed && styles.pressed,
        style,
      ]}
    >
      {icon ? <Ionicons name={icon} size={18} color={isPrimary ? colors.card : colors.text} /> : null}
      <Text style={[styles.text, isPrimary && styles.primaryText, isGhost && styles.ghostText]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  primary: {
    backgroundColor: colors.black,
  },
  secondary: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: {
    minHeight: 44,
    paddingHorizontal: spacing.sm,
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.78,
  },
  text: {
    fontSize: typography.body,
    fontWeight: '800',
    color: colors.text,
  },
  primaryText: {
    color: colors.card,
  },
  ghostText: {
    color: colors.blue,
  },
});
