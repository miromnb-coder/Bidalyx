import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '../constants/theme';
import { QuoteStatus } from '../types/quote';

const statusMap: Record<QuoteStatus, { label: string; text: string; background: string; border: string }> = {
  new: { label: 'UUSI', text: colors.blue, background: colors.blueSoft, border: '#DBEAFE' },
  waiting: { label: 'ODOTTAA', text: colors.orange, background: colors.orangeSoft, border: '#FED7AA' },
  draft: { label: 'LUONNOS', text: colors.mutedText, background: colors.backgroundElevated, border: colors.border },
  sent: { label: 'LÄHETETTY', text: colors.blue, background: colors.blueSoft, border: '#DBEAFE' },
  opened: { label: 'AVATTU', text: colors.blue, background: colors.blueSoft, border: '#DBEAFE' },
  accepted: { label: 'HYVÄKSYTTY', text: colors.green, background: colors.greenSoft, border: '#BBF7D0' },
  rejected: { label: 'HYLÄTTY', text: colors.red, background: colors.redSoft, border: '#FECACA' },
  expired: { label: 'VANHENTUNUT', text: colors.mutedText, background: colors.backgroundElevated, border: colors.border },
};

type StatusBadgeProps = {
  status: QuoteStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const item = statusMap[status];

  return (
    <View style={[styles.badge, { backgroundColor: item.background, borderColor: item.border }]}>
      <Text style={[styles.text, { color: item.text }]}>{item.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  text: {
    fontSize: typography.tiny,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
});
