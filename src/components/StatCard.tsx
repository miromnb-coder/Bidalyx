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
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 118,
    justifyContent: 'space-between',
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  value: {
    fontSize: typography.h2,
    fontWeight: '900',
    color: colors.text,
  },
  label: {
    fontSize: typography.tiny,
    lineHeight: 15,
    color: colors.mutedText,
    fontWeight: '700',
  },
});
