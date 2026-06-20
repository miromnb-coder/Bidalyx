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
        <View style={styles.heroTopRow}>
          <View>
            <Text style={styles.heroLabel}>Avoimissa tarjouksissa</Text>
            <Text style={styles.heroValue}>12 450 €</Text>
          </View>
          <View style={styles.heroIcon}>
            <Ionicons name="trending-up-outline" size={28} color={colors.blue} />
          </View>
        </View>
        <View style={styles.heroDivider} />
        <View style={styles.heroBottomRow}>
          <View>
            <Text style={styles.microLabel}>Tänään</Text>
            <Text style={styles.microValue}>4 uutta pyyntöä</Text>
          </View>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live</Text>
          </View>
        </View>
      </Card>

      <View style={styles.statsRow}>
        <StatCard value="8 420 €" label="Hyväksytty tässä kuussa" icon="arrow-up-circle-outline" tone="green" />
        <StatCard value="68 %" label="Voittoprosentti" icon="pie-chart-outline" tone="blue" />
        <StatCard value="17" label="Hyväksytty" icon="checkmark-circle-outline" tone="green" />
      </View>

      <Button title="Luo tarjous" icon="add" onPress={() => router.push('/(tabs)/create')} />

      <View style={styles.aiCard}>
        <View style={styles.aiIcon}>
          <Ionicons name="sparkles-outline" size={20} color={colors.blue} />
        </View>
        <View style={styles.aiTextWrap}>
          <Text style={styles.aiTitle}>AI auttaa tekemään tarjouksen nopeammin</Text>
          <Text style={styles.aiText}>Lisää asiakkaan viesti ja työn tiedot. Bidalyx tekee siistin luonnoksen.</Text>
        </View>
      </View>

      <SectionTitle title="Viimeaikaiset tarjouspyynnöt" action="Näytä kaikki" />
      {mockQuotes.slice(0, 3).map((quote) => (
        <QuoteCard key={quote.id} quote={quote} onPress={() => router.push(`/quote/${quote.id}`)} />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    minHeight: 170,
    padding: spacing.lg,
    gap: spacing.md,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroLabel: {
    fontSize: typography.body,
    color: colors.mutedText,
    fontWeight: '800',
  },
  heroValue: {
    marginTop: spacing.xs,
    fontSize: 40,
    color: colors.text,
    fontWeight: '900',
    letterSpacing: -1.2,
  },
  heroIcon: {
    width: 60,
    height: 60,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blueSoft,
  },
  heroDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  heroBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  microLabel: {
    fontSize: typography.tiny,
    color: colors.mutedText,
    fontWeight: '800',
  },
  microValue: {
    marginTop: 2,
    fontSize: typography.body,
    color: colors.text,
    fontWeight: '900',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: radii.full,
    backgroundColor: colors.greenSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: radii.full,
    backgroundColor: colors.green,
  },
  liveText: {
    fontSize: typography.tiny,
    color: colors.green,
    fontWeight: '900',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  aiCard: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.xl,
    backgroundColor: colors.blueSoft,
  },
  aiIcon: {
    width: 42,
    height: 42,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  aiTextWrap: {
    flex: 1,
    gap: 2,
  },
  aiTitle: {
    fontSize: typography.small,
    color: colors.text,
    fontWeight: '900',
  },
  aiText: {
    fontSize: typography.small,
    color: colors.mutedText,
    lineHeight: 19,
    fontWeight: '600',
  },
});
