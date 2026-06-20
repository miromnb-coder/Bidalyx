import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { StatusBadge } from '../../src/components/StatusBadge';
import { colors, radii, spacing, typography } from '../../src/constants/theme';
import { useQuotes } from '../../src/state/QuoteContext';
import { QuoteStatus } from '../../src/types/quote';
import { formatCurrency } from '../../src/utils/formatCurrency';

const statusActions: { label: string; status: QuoteStatus; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: 'Luonnos', status: 'draft', icon: 'create-outline' },
  { label: 'Lähetetty', status: 'sent', icon: 'paper-plane-outline' },
  { label: 'Odottaa', status: 'waiting', icon: 'time-outline' },
  { label: 'Hyväksytty', status: 'accepted', icon: 'checkmark-circle-outline' },
  { label: 'Hylätty', status: 'rejected', icon: 'close-circle-outline' },
];

function formatDate(value?: string) {
  if (!value) return 'Ei päivämäärää';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('fi-FI', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function QuoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getQuoteById, updateQuoteStatus, buildPublicShareLink, getAttachmentsByQuoteId, remindCustomer } = useQuotes();
  const quote = getQuoteById(id);
  const attachments = getAttachmentsByQuoteId(id);

  if (!quote) {
    return (
      <Screen>
        <Pressable onPress={() => router.back()} style={styles.backButton}><Ionicons name="arrow-back" size={24} color={colors.text} /></Pressable>
        <Text style={styles.pageTitle}>Tarjousta ei löytynyt</Text>
      </Screen>
    );
  }

  const publicLink = buildPublicShareLink(quote);

  return (
    <Screen>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backButton}><Ionicons name="arrow-back" size={24} color={colors.text} /></Pressable>
        <StatusBadge status={quote.status} />
      </View>

      <Card style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View style={styles.heroText}>
            <Text style={styles.kicker}>{quote.serviceLabel}</Text>
            <Text style={styles.heroTitle}>{quote.jobTitle}</Text>
            <Text style={styles.heroSubtitle}>{quote.customerName} · {quote.location}</Text>
          </View>
          <View style={styles.heroIcon}><Ionicons name="document-text-outline" size={28} color={colors.card} /></View>
        </View>
        <View style={styles.divider} />
        <View style={styles.valueRow}>
          <View><Text style={styles.labelLight}>Tarjouksen arvo</Text><Text style={styles.heroPrice}>{formatCurrency(quote.estimatedValue)}</Text></View>
          <View style={styles.validBox}><Text style={styles.validLabel}>Voimassa</Text><Text style={styles.validValue}>{quote.validUntil}</Text></View>
        </View>
      </Card>

      <View style={styles.quickGrid}>
        <Card style={styles.quickCard}><Ionicons name="calendar-outline" size={21} color={colors.blue} /><Text style={styles.quickValue}>{quote.schedule || 'Ei arviota'}</Text><Text style={styles.quickLabel}>Aikataulu</Text></Card>
        <Card style={styles.quickCard}><Ionicons name="images-outline" size={21} color={colors.blue} /><Text style={styles.quickValue}>{attachments.length || quote.imageCount}</Text><Text style={styles.quickLabel}>Kuvaa</Text></Card>
        <Card style={styles.quickCard}><Ionicons name="time-outline" size={21} color={colors.blue} /><Text style={styles.quickValue}>{formatDate(quote.updatedAt)}</Text><Text style={styles.quickLabel}>Päivitetty</Text></Card>
      </View>

      <Card style={styles.customerCard}><View style={styles.avatar}><Text style={styles.avatarText}>{quote.customerName.slice(0, 2).toUpperCase()}</Text></View><View style={styles.flex}><Text style={styles.cardTitle}>Asiakas</Text><Text style={styles.bodyStrong}>{quote.customerName}</Text><Text style={styles.small}>{quote.customerPhone ?? 'Ei puhelinta'} · {quote.customerEmail ?? 'Ei sähköpostia'}</Text></View></Card>
      <Card><Text style={styles.cardTitle}>Työn kuvaus</Text><Text style={styles.body}>{quote.description}</Text></Card>
      <Card><Text style={styles.cardTitle}>Asiakkaan viesti</Text><Text style={styles.body}>{quote.customerMessage || 'Ei asiakkaan viestiä.'}</Text></Card>

      <Card><View style={styles.cardHeader}><Text style={styles.cardTitle}>Kuvat ja liitteet</Text><Pressable onPress={() => router.push({ pathname: '/quote/images', params: { id: quote.id } })}><Text style={styles.actionText}>Hallitse</Text></Pressable></View>{attachments.length ? <View style={styles.imageRow}>{attachments.slice(0, 3).map((item) => <Image key={item.id} source={{ uri: item.fileUrl }} style={styles.previewImage} />)}</View> : <Text style={styles.body}>Ei kuvia vielä. Lisää kohdekuvia, jotta tarjous on helpompi tarkistaa.</Text>}</Card>
      <Card><Text style={styles.cardTitle}>Sisältää</Text>{quote.includedItems.map((item) => <View key={item} style={styles.checkRow}><Ionicons name="checkmark-circle-outline" size={18} color={colors.blue} /><Text style={styles.body}>{item}</Text></View>)}</Card>
      <Card><Text style={styles.cardTitle}>Tapahtumahistoria</Text>{quote.events.length ? quote.events.map((event) => <View key={event.id} style={styles.eventRow}><View style={styles.eventDot} /><View style={styles.flex}><Text style={styles.eventTitle}>{event.title}</Text><Text style={styles.small}>{event.description}</Text><Text style={styles.eventDate}>{formatDate(event.createdAt)}</Text></View></View>) : <Text style={styles.body}>Ei tapahtumia vielä.</Text>}</Card>
      <Card><Text style={styles.cardTitle}>Status-toiminnot</Text><View style={styles.statusGrid}>{statusActions.map((action) => { const active = quote.status === action.status; return <Pressable key={action.status} onPress={() => updateQuoteStatus(quote.id, action.status)} style={[styles.statusButton, active && styles.statusButtonActive]}><Ionicons name={action.icon} size={16} color={active ? colors.card : colors.text} /><Text style={[styles.statusText, active && styles.statusTextActive]}>{action.label}</Text></Pressable>; })}</View></Card>
      <Card style={styles.linkCard}><Ionicons name="link-outline" size={22} color={colors.blue} /><View style={styles.flex}><Text style={styles.cardTitle}>Asiakkaan linkki</Text><Text style={styles.linkText}>{publicLink}</Text></View></Card>

      <View style={styles.buttonRow}><Button title="Muokkaa" variant="secondary" icon="create-outline" style={styles.flexButton} onPress={() => router.push({ pathname: '/quote/edit', params: { id: quote.id } })} /><Button title="Lähetä" icon="paper-plane-outline" style={styles.flexButton} onPress={() => router.push({ pathname: '/quote/send', params: { id: quote.id } })} /></View>
      <Button title="Avaa dokumentti" variant="secondary" icon="document-text-outline" onPress={() => router.push({ pathname: '/quote-doc', params: { id: quote.id } })} />
      <Button title="Muistuta asiakasta" variant="secondary" icon="notifications-outline" onPress={() => remindCustomer(quote.id)} />
      <Button title="Jaa tarjouslinkki" variant="ghost" icon="share-outline" onPress={() => router.push({ pathname: '/quote/share', params: { id: quote.id } })} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 44, height: 44, justifyContent: 'center', marginLeft: -spacing.sm },
  pageTitle: { marginTop: spacing.xs, fontSize: typography.h1, fontWeight: '900', color: colors.text, letterSpacing: -0.7 },
  heroCard: { backgroundColor: colors.black, gap: spacing.md, padding: spacing.lg },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  heroText: { flex: 1 },
  kicker: { fontSize: typography.tiny, color: colors.subtleText, fontWeight: '900', textTransform: 'uppercase' },
  heroTitle: { marginTop: spacing.xs, fontSize: typography.h1, fontWeight: '900', color: colors.card, letterSpacing: -0.7 },
  heroSubtitle: { marginTop: spacing.xs, fontSize: typography.body, color: colors.subtleText, fontWeight: '700' },
  heroIcon: { width: 56, height: 56, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.12)' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.12)' },
  valueRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: spacing.md },
  labelLight: { fontSize: typography.small, color: colors.subtleText, fontWeight: '800' },
  heroPrice: { marginTop: 2, fontSize: 42, color: colors.card, fontWeight: '900', letterSpacing: -1.2 },
  validBox: { alignItems: 'flex-end' },
  validLabel: { fontSize: typography.tiny, color: colors.subtleText, fontWeight: '800' },
  validValue: { fontSize: typography.small, color: colors.card, fontWeight: '900' },
  quickGrid: { flexDirection: 'row', gap: spacing.sm },
  quickCard: { flex: 1, gap: 4, padding: spacing.md },
  quickValue: { fontSize: typography.small, color: colors.text, fontWeight: '900' },
  quickLabel: { fontSize: typography.tiny, color: colors.mutedText, fontWeight: '800' },
  customerCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: { width: 48, height: 48, borderRadius: radii.full, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.text, fontWeight: '900' },
  flex: { flex: 1 },
  cardTitle: { fontSize: typography.body, color: colors.text, fontWeight: '900', marginBottom: spacing.xs },
  body: { fontSize: typography.body, lineHeight: 22, color: colors.mutedText, fontWeight: '600' },
  bodyStrong: { fontSize: typography.body, lineHeight: 22, color: colors.text, fontWeight: '800' },
  small: { fontSize: typography.small, lineHeight: 20, color: colors.mutedText, fontWeight: '600' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  actionText: { fontSize: typography.small, color: colors.blue, fontWeight: '900' },
  imageRow: { flexDirection: 'row', gap: spacing.sm },
  previewImage: { width: 92, height: 92, borderRadius: radii.md, backgroundColor: colors.background },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
  eventRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  eventDot: { width: 10, height: 10, borderRadius: radii.full, backgroundColor: colors.blue, marginTop: 5 },
  eventTitle: { fontSize: typography.small, color: colors.text, fontWeight: '900' },
  eventDate: { marginTop: 2, fontSize: typography.tiny, color: colors.subtleText, fontWeight: '800' },
  statusGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  statusButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radii.full, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  statusButtonActive: { backgroundColor: colors.black, borderColor: colors.black },
  statusText: { fontSize: typography.small, color: colors.text, fontWeight: '800' },
  statusTextActive: { color: colors.card },
  linkCard: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start', backgroundColor: colors.blueSoft },
  linkText: { fontSize: typography.tiny, color: colors.blue, fontWeight: '900' },
  buttonRow: { flexDirection: 'row', gap: spacing.sm },
  flexButton: { flex: 1 },
});
