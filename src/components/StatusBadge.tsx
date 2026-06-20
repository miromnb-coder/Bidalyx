import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '../constants/theme';
import { QuoteStatus } from '../types/quote';

const statusMap: Record<QuoteStatus, { label: string; text: string; background: string }> = {
  new: { label: 'UUSI', text: colors.blue, background: colors.blueSoft },
  waiting: { label: 'ODOTTAA', text: colors.orange, background: colors.orangeSoft },
  draft: { label: 'LUONNOS', text: colors.mutedText, background: colors.background },
  sent: { label: 'LÄHETETTY', text: colors.blue, background: colors.blueSoft },
  opened: { label: 'AVATTU', text: colors.blue, background: colors.blueSoft },
  accepted: { label: 'HYVÄKSYTTY', text: colors.green, background: colors.greenSoft },
  rejected: { label: 'HYLÄTTY', text: colors.red, background: colors.redSoft },
  expired: { label: 'VANHENTUNUT', text: colors.mutedText, background: colors.background },
};

type StatusBadgeProps = {
  status: QuoteStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const item = statusMap[status];

  return (
    <View style={[styles.badge, { backgroundColor: item.background }]}>
      <Text style={[styles.text, { color: item.text }]}>{item.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radii.full,
  },
  text: {
    fontSize: typography.tiny,
    fontWeight: '900',
  },
});
