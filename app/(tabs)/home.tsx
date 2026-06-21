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
import { colors, radii, shadows, spacing, typography } from '../../src/constants/theme';
import { useQuotes } from '../../src/state/QuoteContext';
import { formatCurrency } from '../../src/utils/formatCurrency';

export default function HomeScreen() {
  const { quotes, customers, dashboard, syncLoading, syncError, refreshRemote } = useQuotes();
  const followUps = quotes.filter((quote) => ['sent', 'waiting', 'opened'].includes(quote.status));
  const drafts = quotes.filter((quote) => quote.status === 'draft');

  return (
    <Screen>
      <AppHeader title="Bidalyx" subtitle="Myynnin työtila" rightIcon="notifications-outline" />

      <Card style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.flex}>
            <Text style={styles.label}>Avoin tarjousarvo</Text>
            <Text style={styles.value}>{formatCurrency(dashboard.openValue)}</Text>
            <Text style={styles.text}>{followUps.length} asiakasta odottaa vastausta · {syncLoading ? 'Synkronoidaan' : 'Synkronoitu'}</Text>
          </View>
          <View style={styles.heroIcon}><Ionicons name="trending-up-outline" size={28} color={colors.blue} /></View>
        </View>
        <View style={styles.divider} />
        <View style={styles.heroBottom}>
          <View><Text style={styles.microLabel}>Paras palvelu</Text><Text style={styles.microValue}>{dashboard.bestServiceLabel}</Text></View>
          <View style={styles.livePill}><View style={styles.liveDot} /><Text style={styles.liveText}>Live</Text></View>
        </View>
      </Card>

      {syncError ? <Card style={styles.errorCard}><Text style={styles.errorText}>{syncError}</Text></Card> : null}

      <View style={styles.row}><StatCard value={formatCurrency(dashboard.acceptedThisMonth)} label="Hyväksytty" icon="checkmark-circle-outline" tone="green" /><StatCard value={`${dashboard.winRate} %`} label="Voitto" icon="pie-chart-outline" tone="blue" /><StatCard value={formatCurrency(dashboard.averageQuoteValue)} label="Keskihinta" icon="cash-outline" tone="orange" /></View>
      <View style={styles.row}><StatCard value={String(followUps.length)} label="Muistuta" icon="notifications-outline" tone="orange" /><StatCard value={String(drafts.length)} label="Luonnokset" icon="document-outline" tone="blue" /><StatCard value={String(customers.length)} label="Asiakkaat" icon="people-outline" tone="green" /></View>
      <View style={styles.row}><Button title="Luo tarjous" icon="add" style={styles.flex} onPress={() => router.push('/(tabs)/create')} /><Button title="Päivitä" variant="secondary" icon="refresh-outline" style={styles.flex} onPress={refreshRemote} /></View>
      <View style={styles.row}><Button title="Ilmoitukset" variant="secondary" icon="notifications-outline" style={styles.flex} onPress={() => router.push('/notifications')} /><Button title="Paketit" variant="secondary" icon="card-outline" style={styles.flex} onPress={() => router.push('/pricing')} /></View>

      <Card style={styles.next}><View style={styles.nextIcon}><Ionicons name="flash-outline" size={18} color={colors.blue} /></View><View style={styles.flex}><Text style={styles.nextTitle}>Seuraava toimenpide</Text><Text style={styles.text}>{followUps.length ? 'Muistuta avoimia asiakkaita ja seuraa hyväksyntöjä.' : drafts.length ? 'Viimeistele luonnokset ja lähetä ne asiakkaille.' : 'Luo uusi tarjous ja aloita myyntiputki.'}</Text></View></Card>

      {followUps.length ? <><SectionTitle title="Muistutettavat tarjoukset" action="" />{followUps.slice(0, 2).map((quote) => <QuoteCard key={quote.id} quote={quote} onPress={() => router.push(`/quote/${quote.id}`)} />)}</> : null}
      <SectionTitle title="Viimeaikaiset tarjouspyynnöt" action="Näytä kaikki" />
      {quotes.slice(0, 3).map((quote) => <QuoteCard key={quote.id} quote={quote} onPress={() => router.push(`/quote/${quote.id}`)} />)}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  hero: { padding: spacing.xl, gap: spacing.md, borderRadius: radii.xxl, minHeight: 184, ...shadows.hero },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  heroIcon: { width: 56, height: 56, borderRadius: radii.full, backgroundColor: colors.blueSoft, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: typography.small, color: colors.mutedText, fontWeight: '800' },
  value: { marginTop: spacing.xs, fontSize: 40, color: colors.text, fontWeight: '900', letterSpacing: -1.2 },
  text: { fontSize: typography.small, lineHeight: 20, color: colors.mutedText, fontWeight: '600' },
  divider: { height: 1, backgroundColor: colors.borderSoft },
  heroBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  microLabel: { fontSize: typography.tiny, color: colors.subtleText, fontWeight: '900', textTransform: 'uppercase' },
  microValue: { marginTop: 2, fontSize: typography.body, color: colors.text, fontWeight: '800' },
  livePill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.greenSoft, paddingHorizontal: spacing.md, paddingVertical: 7, borderRadius: radii.full },
  liveDot: { width: 8, height: 8, borderRadius: radii.full, backgroundColor: colors.green },
  liveText: { fontSize: typography.small, color: colors.green, fontWeight: '800' },
  row: { flexDirection: 'row', gap: spacing.md },
  errorCard: { backgroundColor: colors.redSoft },
  errorText: { color: colors.red, fontWeight: '800' },
  next: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start', backgroundColor: colors.blueSoft, borderColor: '#DCE8FF' },
  nextIcon: { width: 38, height: 38, borderRadius: radii.full, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  nextTitle: { fontSize: typography.body, color: colors.text, fontWeight: '900' },
});
