import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { colors, layout, radii, spacing, typography } from '../constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
  disabled?: boolean;
};

export function Button({ title, onPress, variant = 'primary', icon, style, disabled = false }: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isGhost = variant === 'ghost';
  const iconColor = isPrimary ? colors.card : isGhost ? colors.blue : colors.text;

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.base, isPrimary && styles.primary, variant === 'secondary' && styles.secondary, isGhost && styles.ghost, pressed && !disabled && styles.pressed, disabled && styles.disabled, style]}
    >
      {icon ? <Ionicons name={icon} size={18} color={iconColor} /> : null}
      <Text style={[styles.text, isPrimary && styles.primaryText, isGhost && styles.ghostText]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: layout.buttonHeight,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  primary: { backgroundColor: colors.black },
  secondary: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  ghost: { minHeight: 44, paddingHorizontal: spacing.sm, backgroundColor: 'transparent' },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.86 },
  disabled: { opacity: 0.44 },
  text: { fontSize: typography.body, fontWeight: '800', color: colors.text, letterSpacing: -0.1 },
  primaryText: { color: colors.card },
  ghostText: { color: colors.blue },
});
