import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '../src/components/Card';
import { Screen } from '../src/components/Screen';
import { StatCard } from '../src/components/StatCard';
import { colors, spacing, typography } from '../src/constants/theme';
import { useQuotes } from '../src/state/QuoteContext';
import { formatCurrency } from '../src/utils/formatCurrency';

export default function AnalyticsScreen() {
  const { dashboard, quotes } = useQuotes();
  const openQuotes = quotes.filter((quote) => ['new', 'waiting', 'draft', 'sent', 'opened'].includes(quote.status));

  return (
    <Screen>
      <Pressable onPress={() => router.back()} style={styles.backButton}><Ionicons name="arrow-back" size={24} color={colors.text} /></Pressable>
      <Text style={styles.title}>Analytiikka</Text>
      <Text style={styles.subtitle}>Näe, miten tarjousmyynti kehittyy.</Text>
      <View style={styles.row}><StatCard value={formatCurrency(dashboard.openValue)} label="Avoin arvo" icon="trending-up-outline" tone="blue" /><StatCard value={`${dashboard.winRate} %`} label="Voittoprosentti" icon="pie-chart-outline" tone="green" /></View>
      <View style={styles.row}><StatCard value={formatCurrency(dashboard.averageQuoteValue)} label="Keskihinta" icon="cash-outline" tone="orange" /><StatCard value={String(dashboard.rejectedCount)} label="Hylätty" icon="close-circle-outline" tone="orange" /></View>
      <Card><Text style={styles.cardTitle}>Paras palvelu</Text><Text style={styles.big}>{dashboard.bestServiceLabel}</Text><Text style={styles.body}>Eniten tarjousarvoa kerännyt palvelutyyppi.</Text></Card>
      <Card><Text style={styles.cardTitle}>Avoimet tarjoukset</Text>{openQuotes.slice(0, 5).map((quote) => <Text key={quote.id} style={styles.body}>• {quote.jobTitle} — {formatCurrency(quote.estimatedValue)}</Text>)}</Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: { width: 44, height: 44, justifyContent: 'center', marginLeft: -spacing.sm },
  title: { fontSize: typography.title, fontWeight: '900', color: colors.text },
  subtitle: { fontSize: typography.body, lineHeight: 22, color: colors.mutedText, fontWeight: '600' },
  row: { flexDirection: 'row', gap: spacing.sm },
  cardTitle: { fontSize: typography.body, fontWeight: '900', color: colors.text, marginBottom: spacing.xs },
  big: { fontSize: typography.h1, fontWeight: '900', color: colors.text },
  body: { marginTop: spacing.xs, fontSize: typography.body, lineHeight: 22, color: colors.mutedText, fontWeight: '600' },
});
