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
    minHeight: 104,
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: radii.lg,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  value: {
    fontSize: typography.h3,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.4,
  },
  label: {
    marginTop: 2,
    fontSize: typography.tiny,
    lineHeight: 15,
    color: colors.mutedText,
    fontWeight: '800',
  },
});
