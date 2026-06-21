import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from './Card';
import { colors, radii, spacing, typography } from '../constants/theme';

type StatCardProps = {
  value: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  tone?: 'blue' | 'green' | 'orange';
};

export function StatCard({ value, label, icon, tone = 'blue' }: StatCardProps) {
  const accent = tone === 'green' ? colors.green : tone === 'orange' ? colors.orange : colors.blue;
  const soft = tone === 'green' ? colors.greenSoft : tone === 'orange' ? colors.orangeSoft : colors.blueSoft;

  return (
    <Card style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: soft }]}>
        <Ionicons name={icon} size={18} color={accent} />
      </View>
      <View>
        <Text style={styles.value} numberOfLines={1}>{value}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 112,
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: radii.xl,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  value: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.5,
  },
  label: {
    marginTop: 2,
    fontSize: typography.small,
    lineHeight: 18,
    color: colors.mutedText,
    fontWeight: '800',
  },
});
