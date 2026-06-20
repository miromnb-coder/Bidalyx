import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { StatusBadge } from '../../src/components/StatusBadge';
import { colors, spacing, typography } from '../../src/constants/theme';
import { mockQuotes } from '../../src/data/mockQuotes';
import { formatCurrency } from '../../src/utils/formatCurrency';

export default function QuoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const quote = mockQuotes.find((item) => item.id === id) ?? mockQuotes[0];

  return (
    <Screen>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </Pressable>

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{quote.jobTitle}</Text>
          <Text style={styles.subtitle}>{quote.customerName} · {quote.location}</Text>
        </View>
        <StatusBadge status={quote.status} />
      </View>

      <Card style={styles.priceCard}>
        <Text style={styles.label}>Tarjouksen arvo</Text>
        <Text style={styles.price}>{formatCurrency(quote.estimatedValue)}</Text>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Työn kuvaus</Text>
        <Text style={styles.body}>{quote.description}</Text>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Aikataulu</Text>
        <Text style={styles.body}>{quote.schedule}</Text>
      </Card>

      <Button title="Muokkaa" variant="secondary" icon="create-outline" />
      <Button title="Lähetä asiakkaalle" icon="paper-plane-outline" onPress={() => router.push('/quote/customer-preview')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    marginLeft: -spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  title: {
    fontSize: typography.h1,
    fontWeight: '900',
    color: colors.text,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: typography.body,
    color: colors.mutedText,
    fontWeight: '700',
  },
  priceCard: {
    padding: spacing.lg,
  },
  label: {
    fontSize: typography.small,
    color: colors.mutedText,
    fontWeight: '800',
  },
  price: {
    marginTop: spacing.xs,
    fontSize: typography.title,
    fontWeight: '900',
    color: colors.text,
  },
  cardTitle: {
    fontSize: typography.body,
    color: colors.text,
    fontWeight: '900',
    marginBottom: spacing.xs,
  },
  body: {
    fontSize: typography.body,
    lineHeight: 22,
    color: colors.mutedText,
    fontWeight: '600',
  },
});
