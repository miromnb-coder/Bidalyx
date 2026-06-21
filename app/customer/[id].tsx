import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { QuoteCard } from '../../src/components/QuoteCard';
import { Screen } from '../../src/components/Screen';
import { colors, radii, spacing, typography } from '../../src/constants/theme';
import { useQuotes } from '../../src/state/QuoteContext';
import { formatCurrency } from '../../src/utils/formatCurrency';

export default function CustomerProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getCustomerById, getQuotesByCustomerId } = useQuotes();
  const customer = getCustomerById(id);
  const quotes = getQuotesByCustomerId(id);

  if (!customer) return <Screen><Text style={styles.title}>Asiakasta ei löytynyt</Text></Screen>;

  const openQuotes = quotes.filter((quote) => ['new', 'draft', 'sent', 'opened', 'waiting'].includes(quote.status));
  const acceptedQuotes = quotes.filter((quote) => quote.status === 'accepted');
  const rejectedQuotes = quotes.filter((quote) => quote.status === 'rejected');
  const latestQuote = quotes[0];
  const openValue = openQuotes.reduce((sum, quote) => sum + quote.estimatedValue, 0);
  const winRate = acceptedQuotes.length + rejectedQuotes.length ? Math.round((acceptedQuotes.length / (acceptedQuotes.length + rejectedQuotes.length)) * 100) : 0;

  return (
    <Screen>
      <Pressable onPress={() => router.back()} style={styles.backButton}><Ionicons name="arrow-back" size={24} color={colors.text} /></Pressable>
      <Card style={styles.hero}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{customer.name.slice(0, 2).toUpperCase()}</Text></View>
        <Text style={styles.title}>{customer.name}</Text>
        <Text style={styles.subtitle}>{customer.phone ?? 'Ei puhelinta'} · {customer.email ?? 'Ei sähköpostia'}</Text>
        <Text style={styles.location}>{customer.location ?? 'Sijaintia ei lisätty'}</Text>
      </Card>

      <View style={styles.statsRow}>
        <Card style={styles.stat}><Text style={styles.statValue}>{customer.quotesCount}</Text><Text style={styles.statLabel}>Tarjousta</Text></Card>
        <Card style={styles.stat}><Text style={styles.statValue}>{formatCurrency(customer.totalValue)}</Text><Text style={styles.statLabel}>Kokonaisarvo</Text></Card>
      </View>
      <View style={styles.statsRow}>
        <Card style={styles.stat}><Text style={styles.statValue}>{formatCurrency(openValue)}</Text><Text style={styles.statLabel}>Avoin arvo</Text></Card>
        <Card style={styles.stat}><Text style={styles.statValue}>{winRate} %</Text><Text style={styles.statLabel}>Voitto</Text></Card>
      </View>

      <Card style={styles.crmCard}>
        <View style={styles.crmRow}><Ionicons name="flash-outline" size={21} color={colors.blue} /><View style={styles.flex}><Text style={styles.cardTitle}>CRM-seuraava askel</Text><Text style={styles.body}>{openQuotes.length ? 'Asiakkaalla on avoimia tarjouksia. Lähetä muistutus tai soita asiakkaalle.' : latestQuote ? 'Ei avoimia tarjouksia. Voit luoda uuden tarjouksen tälle asiakkaalle.' : 'Asiakkaalla ei ole vielä tarjouksia.'}</Text></View></View>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Asiakasmuistiinpanot</Text>
        <Text style={styles.body}>Lisää myöhemmin muistiinpanot, tagit ja yhteydenottohistoria. Tämän asiakkaan viimeisin työ: {customer.latestJob}</Text>
      </Card>

      <Button title="Luo uusi tarjous" icon="add" onPress={() => router.push('/(tabs)/create')} />
      <Text style={styles.sectionTitle}>Asiakkaan tarjoukset</Text>
      {quotes.length ? quotes.map((quote) => <QuoteCard key={quote.id} quote={quote} onPress={() => router.push(`/quote/${quote.id}`)} />) : <Card><Text style={styles.body}>Ei tarjouksia vielä.</Text></Card>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: { width: 44, height: 44, justifyContent: 'center', marginLeft: -spacing.sm },
  hero: { alignItems: 'center', gap: spacing.xs, padding: spacing.xl },
  avatar: { width: 68, height: 68, borderRadius: radii.full, backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.card, fontSize: typography.h2, fontWeight: '900' },
  title: { fontSize: typography.h1, fontWeight: '900', color: colors.text, textAlign: 'center' },
  subtitle: { fontSize: typography.small, fontWeight: '700', color: colors.mutedText, textAlign: 'center' },
  location: { fontSize: typography.tiny, fontWeight: '800', color: colors.blue, textAlign: 'center' },
  statsRow: { flexDirection: 'row', gap: spacing.sm },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: typography.h3, color: colors.text, fontWeight: '900' },
  statLabel: { marginTop: 2, fontSize: typography.tiny, color: colors.mutedText, fontWeight: '800' },
  crmCard: { backgroundColor: colors.blueSoft },
  crmRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  flex: { flex: 1 },
  cardTitle: { fontSize: typography.body, color: colors.text, fontWeight: '900' },
  body: { marginTop: spacing.xs, fontSize: typography.body, lineHeight: 22, color: colors.mutedText, fontWeight: '600' },
  sectionTitle: { fontSize: typography.h3, fontWeight: '900', color: colors.text, marginTop: spacing.sm },
});
