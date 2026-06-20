import { Text, TextInput, TextInputProps, StyleSheet, View } from 'react-native';

import { colors, radii, spacing, typography } from '../constants/theme';

type TextFieldProps = TextInputProps & {
  label: string;
};

export function TextField({ label, multiline, style, ...props }: TextFieldProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        multiline={multiline}
        placeholderTextColor={colors.subtleText}
        style={[styles.input, multiline && styles.multiline, style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xs,
  },
  label: {
    fontSize: typography.small,
    fontWeight: '800',
    color: colors.text,
  },
  input: {
    minHeight: 52,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    fontSize: typography.body,
    color: colors.text,
  },
  multiline: {
    minHeight: 128,
    paddingTop: spacing.md,
    textAlignVertical: 'top',
  },
});
