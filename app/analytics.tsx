import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '../src/components/Card';
import { Screen } from '../src/components/Screen';
import { StatCard } from '../src/components/StatCard';
import { colors, radii, spacing, typography } from '../src/constants/theme';
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
      <Card style={styles.hero}><Text style={styles.heroLabel}>Avoin myynti</Text><Text style={styles.heroValue}>{formatCurrency(dashboard.openValue)}</Text><Text style={styles.heroText}>{openQuotes.length} avointa tarjousta.</Text></Card>
      <View style={styles.row}><StatCard value={formatCurrency(dashboard.averageQuoteValue)} label="Keskihinta" icon="cash-outline" tone="orange" /><StatCard value={`${dashboard.winRate} %`} label="Voitto" icon="pie-chart-outline" tone="green" /></View>
      <Card><Text style={styles.cardTitle}>Paras palvelu</Text><Text style={styles.big}>{dashboard.bestServiceLabel}</Text><Text style={styles.body}>Eniten tarjousarvoa kerännyt palvelutyyppi.</Text></Card>
      <Card><Text style={styles.cardTitle}>Avoimet tarjoukset</Text>{openQuotes.slice(0, 5).map((quote) => <Text key={quote.id} style={styles.body}>• {quote.jobTitle} — {formatCurrency(quote.estimatedValue)}</Text>)}</Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: { width: 44, height: 44, justifyContent: 'center', marginLeft: -spacing.sm },
  title: { fontSize: typography.title, fontWeight: '900', color: colors.text, letterSpacing: -0.8 },
  subtitle: { fontSize: typography.body, lineHeight: 22, color: colors.mutedText, fontWeight: '600' },
  hero: { backgroundColor: colors.black, borderColor: colors.black, borderRadius: radii.xxl },
  heroLabel: { fontSize: typography.tiny, color: colors.subtleText, fontWeight: '900', textTransform: 'uppercase' },
  heroValue: { marginTop: spacing.xs, fontSize: 40, color: colors.card, fontWeight: '900' },
  heroText: { marginTop: spacing.xs, fontSize: typography.body, color: colors.subtleText, fontWeight: '600' },
  row: { flexDirection: 'row', gap: spacing.sm },
  cardTitle: { fontSize: typography.body, fontWeight: '900', color: colors.text, marginBottom: spacing.xs },
  big: { fontSize: typography.h1, fontWeight: '900', color: colors.text },
  body: { marginTop: spacing.xs, fontSize: typography.body, lineHeight: 22, color: colors.mutedText, fontWeight: '600' },
});
