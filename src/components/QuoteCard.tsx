import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from './Card';
import { StatusBadge } from './StatusBadge';
import { colors, radii, spacing, typography } from '../constants/theme';
import { Quote } from '../types/quote';
import { formatCurrency } from '../utils/formatCurrency';

type QuoteCardProps = {
  quote: Quote;
  onPress?: () => void;
};

const serviceLabels: Record<Quote['serviceType'], string> = {
  painting: 'Maalaus',
  cleaning: 'Siivous',
  moving: 'Muutto',
  garden: 'Pihatyö',
  renovation: 'Remontti',
  other: 'Muu',
};

export function QuoteCard({ quote, onPress }: QuoteCardProps) {
  const initials = quote.customerName
    .split(' ')
    .map((name) => name[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Pressable onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.mainInfo}>
            <Text style={styles.name}>{quote.customerName}</Text>
            <Text style={styles.job}>{quote.jobTitle}, {quote.location}</Text>
            <Text style={styles.time}>{quote.requestedAt}</Text>
          </View>
          <View style={styles.rightArea}>
            <StatusBadge status={quote.status} />
            {quote.status === 'accepted' ? <Text style={styles.price}>{formatCurrency(quote.estimatedValue)}</Text> : null}
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="construct-outline" size={14} color={colors.mutedText} />
            <Text style={styles.metaText}>{serviceLabels[quote.serviceType]}</Text>
          </View>
          {quote.area ? (
            <View style={styles.metaItem}>
              <Ionicons name="resize-outline" size={14} color={colors.mutedText} />
              <Text style={styles.metaText}>{quote.area} m²</Text>
            </View>
          ) : null}
          <View style={styles.metaItem}>
            <Ionicons name="image-outline" size={14} color={colors.mutedText} />
            <Text style={styles.metaText}>{quote.imageCount} kuvaa</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.subtleText} style={styles.chevron} />
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radii.full,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: typography.small,
    fontWeight: '900',
    color: colors.text,
  },
  mainInfo: {
    flex: 1,
  },
  name: {
    fontSize: typography.body,
    fontWeight: '900',
    color: colors.text,
  },
  job: {
    marginTop: 2,
    fontSize: typography.small,
    color: colors.text,
  },
  time: {
    marginTop: 3,
    fontSize: typography.tiny,
    color: colors.mutedText,
    fontWeight: '700',
  },
  rightArea: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  price: {
    fontSize: typography.small,
    color: colors.green,
    fontWeight: '900',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: typography.tiny,
    color: colors.mutedText,
    fontWeight: '800',
  },
  chevron: {
    marginLeft: 'auto',
  },
});
