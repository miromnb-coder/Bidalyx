import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../constants/theme';

type SectionTitleProps = {
  title: string;
  action?: string;
  onActionPress?: () => void;
};

export function SectionTitle({ title, action }: SectionTitleProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {action ? <Text style={styles.action}>{action}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  title: {
    fontSize: typography.h3,
    fontWeight: '900',
    color: colors.text,
  },
  action: {
    fontSize: typography.small,
    fontWeight: '800',
    color: colors.blue,
  },
});
