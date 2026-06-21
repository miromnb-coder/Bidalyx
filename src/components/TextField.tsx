import { Text, TextInput, TextInputProps, StyleSheet, View } from 'react-native';

import { colors, layout, radii, spacing, typography } from '../constants/theme';

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
    fontWeight: '900',
    color: colors.text,
  },
  input: {
    minHeight: layout.inputHeight,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    fontSize: typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  multiline: {
    minHeight: 132,
    paddingTop: spacing.md,
    textAlignVertical: 'top',
  },
});
