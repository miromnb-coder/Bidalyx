import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Share, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { colors, radii, spacing, typography } from '../../src/constants/theme';
import { useQuotes } from '../../src/state/QuoteContext';

export default function SendQuoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getQuoteById, buildShareLink, markQuoteSent, messageTemplates } = useQuotes();
  const quote = getQuoteById(id);

  if (!quote) return <Screen><Text style={styles.title}>Tarjousta ei löytynyt</Text></Screen>;

  const link = buildShareLink(quote);
  const template = messageTemplates.find((item) => item.type === 'quote_sent');
  const message = (template?.body ?? 'Hei! Tässä tarjouksesi: {{link}}').replace('{{link}}', link);

  async function share() {
    await markQuoteSent(quote.id);
    await Share.share({ message });
  }

  return (
    <Screen>
      <Text style={styles.title}>Lähetä tarjous</Text>
      <Text style={styles.subtitle}>Valmis viesti ja tarjouslinkki asiakkaalle.</Text>
      <Card style={styles.card}><Text style={styles.label}>Asiakas</Text><Text style={styles.value}>{quote.customerName}</Text><Text style={styles.body}>{quote.customerEmail ?? 'Ei sähköpostia'} · {quote.customerPhone ?? 'Ei puhelinta'}</Text></Card>
      <Card style={styles.card}><Text style={styles.label}>Tarjouslinkki</Text><Text style={styles.link}>{link}</Text></Card>
      <Card style={styles.messageCard}><View style={styles.icon}><Ionicons name="chatbubble-ellipses-outline" size={22} color={colors.blue} /></View><Text style={styles.body}>{message}</Text></Card>
      <Button title="Jaa puhelimen kautta" icon="share-outline" onPress={share} />
      <Button title="Avaa asiakkaan näkymä" variant="secondary" icon="eye-outline" onPress={() => router.push({ pathname: '/quote/customer-preview', params: { id: quote.id } })} />
      <Button title="Palaa" variant="ghost" icon="arrow-back-outline" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: typography.title, color: colors.text, fontWeight: '900' },
  subtitle: { fontSize: typography.body, lineHeight: 22, color: colors.mutedText, fontWeight: '600' },
  card: { gap: spacing.xs },
  label: { fontSize: typography.small, color: colors.mutedText, fontWeight: '800' },
  value: { fontSize: typography.h3, color: colors.text, fontWeight: '900' },
  body: { flex: 1, fontSize: typography.body, lineHeight: 22, color: colors.mutedText, fontWeight: '600' },
  link: { fontSize: typography.body, color: colors.blue, fontWeight: '900' },
  messageCard: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  icon: { width: 44, height: 44, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.blueSoft },
});
