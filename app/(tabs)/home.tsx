import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '../../src/components/AppHeader';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { QuoteCard } from '../../src/components/QuoteCard';
import { Screen } from '../../src/components/Screen';
import { SectionTitle } from '../../src/components/SectionTitle';
import { StatCard } from '../../src/components/StatCard';
import { colors, radii, spacing, typography } from '../../src/constants/theme';
import { mockQuotes } from '../../src/data/mockQuotes';

export default function HomeScreen() {
  return (
    <Screen>
      <AppHeader title="Bidalyx" subtitle="Tarjoukset hallinnassa" rightIcon="notifications-outline" />

      <Card style={styles.heroCard}>
        <View>
          <Text style={styles.heroLabel}>Avoimissa tarjouksissa</Text>
          <Text style={styles.heroValue}>12 450 €</Text>
        </View>
        <View style={styles.heroIcon}>
          <Ionicons name="trending-up-outline" size={28} color={colors.blue} />
        </View>
      </Card>

      <View style={styles.statsRow}>
        <StatCard value="8 420 €" label="Hyväksytty tässä kuussa" icon="arrow-up-circle-outline" tone="green" />
        <StatCard value="68 %" label="Voittoprosentti" icon="pie-chart-outline" tone="blue" />
        <StatCard value="17" label="Hyväksytty" icon="checkmark-circle-outline" tone="green" />
      </View>

      <Button title="Luo tarjous" icon="add" onPress={() => router.push('/(tabs)/create')} />

      <SectionTitle title="Viimeaikaiset tarjouspyynnöt" action="Näytä kaikki" />
      {mockQuotes.slice(0, 3).map((quote) => (
        <QuoteCard key={quote.id} quote={quote} onPress={() => router.push(`/quote/${quote.id}`)} />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    minHeight: 130,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  heroLabel: {
    fontSize: typography.body,
    color: colors.mutedText,
    fontWeight: '700',
  },
  heroValue: {
    marginTop: spacing.xs,
    fontSize: typography.title,
    color: colors.text,
    fontWeight: '900',
    letterSpacing: -1,
  },
  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blueSoft,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
