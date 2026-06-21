import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '../../src/components/AppHeader';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { QuoteCard } from '../../src/components/QuoteCard';
import { Screen } from '../../src/components/Screen';
import { SectionTitle } from '../../src/components/SectionTitle';
import { StatCard } from '../../src/components/StatCard';
import { colors, spacing, typography } from '../../src/constants/theme';
import { useQuotes } from '../../src/state/QuoteContext';
import { formatCurrency } from '../../src/utils/formatCurrency';

export default function HomeScreen() {
  const { quotes, customers, dashboard, syncLoading, syncError, refreshRemote } = useQuotes();
  const followUps = quotes.filter((quote) => ['sent', 'waiting', 'opened'].includes(quote.status));
  const drafts = quotes.filter((quote) => quote.status === 'draft');

  return (
    <Screen>
      <AppHeader title="Bidalyx" subtitle="Myynnin työtila" rightIcon="notifications-outline" />
      <Card style={styles.hero}><Text style={styles.label}>Avoin tarjousarvo</Text><Text style={styles.value}>{formatCurrency(dashboard.openValue)}</Text><Text style={styles.text}>{followUps.length} asiakasta odottaa vastausta · {syncLoading ? 'Synkronoidaan' : 'Synkronoitu'}</Text></Card>
      {syncError ? <Card style={styles.errorCard}><Text style={styles.errorText}>{syncError}</Text></Card> : null}
      <View style={styles.row}><StatCard value={formatCurrency(dashboard.acceptedThisMonth)} label="Hyväksytty" icon="checkmark-circle-outline" tone="green" /><StatCard value={`${dashboard.winRate} %`} label="Voitto" icon="pie-chart-outline" tone="blue" /><StatCard value={formatCurrency(dashboard.averageQuoteValue)} label="Keskihinta" icon="cash-outline" tone="orange" /></View>
      <View style={styles.row}><StatCard value={String(followUps.length)} label="Muistuta" icon="notifications-outline" tone="orange" /><StatCard value={String(drafts.length)} label="Luonnokset" icon="document-outline" tone="blue" /><StatCard value={String(customers.length)} label="Asiakkaat" icon="people-outline" tone="green" /></View>
      <View style={styles.row}><Button title="Luo tarjous" icon="add" style={styles.flex} onPress={() => router.push('/(tabs)/create')} /><Button title="Päivitä" variant="secondary" icon="refresh-outline" style={styles.flex} onPress={refreshRemote} /></View>
      <Card style={styles.next}><Text style={styles.nextTitle}>Seuraava toimenpide</Text><Text style={styles.text}>{followUps.length ? 'Muistuta avoimia asiakkaita ja seuraa hyväksyntöjä.' : drafts.length ? 'Viimeistele luonnokset ja lähetä ne asiakkaille.' : 'Luo uusi tarjous ja aloita myyntiputki.'}</Text></Card>
      {followUps.length ? <><SectionTitle title="Muistutettavat tarjoukset" action="" />{followUps.slice(0, 2).map((quote) => <QuoteCard key={quote.id} quote={quote} onPress={() => router.push(`/quote/${quote.id}`)} />)}</> : null}
      <SectionTitle title="Viimeaikaiset tarjouspyynnöt" action="Näytä kaikki" />
      {quotes.slice(0, 3).map((quote) => <QuoteCard key={quote.id} quote={quote} onPress={() => router.push(`/quote/${quote.id}`)} />)}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  hero: { padding: spacing.lg, gap: spacing.xs },
  label: { fontSize: typography.small, color: colors.mutedText, fontWeight: '800' },
  value: { fontSize: 40, color: colors.text, fontWeight: '900' },
  text: { fontSize: typography.body, lineHeight: 22, color: colors.mutedText, fontWeight: '600' },
  row: { flexDirection: 'row', gap: spacing.sm },
  errorCard: { backgroundColor: colors.redSoft },
  errorText: { color: colors.red, fontWeight: '800' },
  next: { backgroundColor: colors.blueSoft },
  nextTitle: { fontSize: typography.h3, color: colors.text, fontWeight: '900' },
});
