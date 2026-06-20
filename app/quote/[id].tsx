import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { StatusBadge } from '../../src/components/StatusBadge';
import { colors, radii, spacing, typography } from '../../src/constants/theme';
import { useQuotes } from '../../src/state/QuoteContext';
import { QuoteStatus } from '../../src/types/quote';
import { formatCurrency } from '../../src/utils/formatCurrency';

const statusActions: { label: string; status: QuoteStatus }[] = [
  { label: 'Luonnos', status: 'draft' },
  { label: 'Lähetetty', status: 'sent' },
  { label: 'Odottaa', status: 'waiting' },
  { label: 'Hyväksytty', status: 'accepted' },
  { label: 'Hylätty', status: 'rejected' },
];

export default function QuoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getQuoteById, updateQuoteStatus, buildShareLink } = useQuotes();
  const quote = getQuoteById(id);

  if (!quote) {
    return (
      <Screen>
        <Pressable onPress={() => router.back()} style={styles.backButton}><Ionicons name="arrow-back" size={24} color={colors.text} /></Pressable>
        <Text style={styles.title}>Tarjousta ei löytynyt</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Pressable onPress={() => router.back()} style={styles.backButton}><Ionicons name="arrow-back" size={24} color={colors.text} /></Pressable>
      <View style={styles.header}><View style={styles.flex}><Text style={styles.title}>{quote.jobTitle}</Text><Text style={styles.subtitle}>{quote.customerName} · {quote.location}</Text></View><StatusBadge status={quote.status} /></View>
      <Card style={styles.priceCard}><Text style={styles.label}>Tarjouksen arvo</Text><Text style={styles.price}>{formatCurrency(quote.estimatedValue)}</Text><Text style={styles.linkText}>{buildShareLink(quote)}</Text></Card>
      <Card style={styles.customerCard}><View style={styles.avatar}><Text style={styles.avatarText}>{quote.customerName.slice(0, 2).toUpperCase()}</Text></View><View style={styles.flex}><Text style={styles.cardTitle}>Asiakas</Text><Text style={styles.body}>{quote.customerName}</Text><Text style={styles.small}>{quote.customerPhone ?? 'Ei puhelinta'} · {quote.customerEmail ?? 'Ei sähköpostia'}</Text></View></Card>
      <Card><Text style={styles.cardTitle}>Työn kuvaus</Text><Text style={styles.body}>{quote.description}</Text></Card>
      <Card><Text style={styles.cardTitle}>Asiakkaan viesti</Text><Text style={styles.body}>{quote.customerMessage}</Text></Card>
      <Card><Text style={styles.cardTitle}>Sisältää</Text>{quote.includedItems.map((item) => <View key={item} style={styles.checkRow}><Ionicons name="checkmark-circle-outline" size={18} color={colors.blue} /><Text style={styles.body}>{item}</Text></View>)}</Card>
      <Card><Text style={styles.cardTitle}>Tapahtumahistoria</Text>{quote.events.map((event) => <View key={event.id} style={styles.eventRow}><View style={styles.eventDot} /><View style={styles.flex}><Text style={styles.eventTitle}>{event.title}</Text><Text style={styles.small}>{event.description}</Text></View></View>)}</Card>
      <View style={styles.actionsGrid}>{statusActions.map((action) => <Pressable key={action.status} onPress={() => updateQuoteStatus(quote.id, action.status)} style={[styles.statusButton, quote.status === action.status && styles.statusButtonActive]}><Text style={[styles.statusButtonText, quote.status === action.status && styles.statusButtonTextActive]}>{action.label}</Text></Pressable>)}</View>
      <Button title="Muokkaa tarjousta" variant="secondary" icon="create-outline" onPress={() => router.push({ pathname: '/quote/edit', params: { id: quote.id } })} />
      <Button title="Lähetä asiakkaalle" icon="paper-plane-outline" onPress={() => router.push({ pathname: '/quote/customer-preview', params: { id: quote.id } })} />
      <Button title="Jaa tarjouslinkki" variant="ghost" icon="share-outline" onPress={() => router.push({ pathname: '/quote/share', params: { id: quote.id } })} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: { width: 44, height: 44, justifyContent: 'center', marginLeft: -spacing.sm },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.md },
  flex: { flex: 1 },
  title: { fontSize: typography.h1, fontWeight: '900', color: colors.text },
  subtitle: { marginTop: spacing.xs, fontSize: typography.body, color: colors.mutedText, fontWeight: '700' },
  priceCard: { padding: spacing.lg },
  label: { fontSize: typography.small, color: colors.mutedText, fontWeight: '800' },
  price: { marginTop: spacing.xs, fontSize: typography.title, fontWeight: '900', color: colors.text },
  linkText: { marginTop: spacing.sm, fontSize: typography.tiny, fontWeight: '800', color: colors.blue },
  customerCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: { width: 46, height: 46, borderRadius: radii.full, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontWeight: '900', color: colors.text },
  cardTitle: { fontSize: typography.body, color: colors.text, fontWeight: '900', marginBottom: spacing.xs },
  body: { fontSize: typography.body, lineHeight: 22, color: colors.mutedText, fontWeight: '600' },
  small: { fontSize: typography.small, lineHeight: 20, color: colors.mutedText, fontWeight: '600' },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
  eventRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  eventDot: { width: 10, height: 10, borderRadius: radii.full, backgroundColor: colors.blue, marginTop: 5 },
  eventTitle: { fontSize: typography.small, fontWeight: '900', color: colors.text },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  statusButton: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radii.full, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  statusButtonActive: { backgroundColor: colors.black, borderColor: colors.black },
  statusButtonText: { fontSize: typography.small, color: colors.mutedText, fontWeight: '800' },
  statusButtonTextActive: { color: colors.card },
});
