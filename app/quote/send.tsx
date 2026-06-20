import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Linking, Share, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { colors, radii, spacing, typography } from '../../src/constants/theme';
import { useQuotes } from '../../src/state/QuoteContext';

export default function SendQuoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getQuoteById, markQuoteSent, messageTemplates, buildPublicShareLink } = useQuotes();
  const quote = getQuoteById(id);

  if (!quote) return <Screen><Text style={styles.title}>Tarjousta ei löytynyt</Text></Screen>;

  const link = buildPublicShareLink(quote);
  const template = messageTemplates.find((item) => item.type === 'quote_sent');
  const message = (template?.body ?? 'Hei! Tässä tarjouksesi: {{link}}').replace('{{link}}', link);
  const encodedMessage = encodeURIComponent(message);
  const encodedSubject = encodeURIComponent(`Tarjous: ${quote.jobTitle}`);

  async function markSentAndOpen(url?: string) {
    await markQuoteSent(quote.id);
    if (url) await Linking.openURL(url);
  }

  async function share() {
    await markQuoteSent(quote.id);
    await Share.share({ message });
  }

  return (
    <Screen>
      <Text style={styles.title}>Lähetä tarjous</Text>
      <Text style={styles.subtitle}>Valmis viesti, asiakkaan tiedot ja oikea verkkolinkki yhdessä paikassa.</Text>

      <Card style={styles.customerCard}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{quote.customerName.slice(0, 2).toUpperCase()}</Text></View>
        <View style={styles.flex}>
          <Text style={styles.label}>Asiakas</Text>
          <Text style={styles.value}>{quote.customerName}</Text>
          <Text style={styles.body}>{quote.customerEmail ?? 'Ei sähköpostia'} · {quote.customerPhone ?? 'Ei puhelinta'}</Text>
        </View>
      </Card>

      <Card style={styles.linkCard}>
        <Ionicons name="link-outline" size={24} color={colors.blue} />
        <View style={styles.flex}>
          <Text style={styles.label}>Tarjouslinkki</Text>
          <Text style={styles.link}>{link}</Text>
        </View>
      </Card>

      <Card style={styles.messageCard}>
        <View style={styles.icon}><Ionicons name="chatbubble-ellipses-outline" size={22} color={colors.blue} /></View>
        <View style={styles.flex}>
          <Text style={styles.label}>Valmis viesti</Text>
          <Text style={styles.body}>{message}</Text>
        </View>
      </Card>

      <Button title="Jaa puhelimen kautta" icon="share-outline" onPress={share} />
      <View style={styles.row}>
        <Button title="Sähköposti" variant="secondary" icon="mail-outline" style={styles.rowButton} onPress={() => markSentAndOpen(`mailto:${quote.customerEmail ?? ''}?subject=${encodedSubject}&body=${encodedMessage}`)} />
        <Button title="SMS" variant="secondary" icon="chatbox-outline" style={styles.rowButton} onPress={() => markSentAndOpen(`sms:${quote.customerPhone ?? ''}?body=${encodedMessage}`)} />
      </View>
      <Button title="WhatsApp" variant="secondary" icon="logo-whatsapp" onPress={() => markSentAndOpen(`https://wa.me/?text=${encodedMessage}`)} />
      <Button title="Avaa asiakkaan esikatselu" variant="ghost" icon="eye-outline" onPress={() => router.push({ pathname: '/quote/customer-preview', params: { id: quote.id } })} />
      <Button title="Palaa" variant="ghost" icon="arrow-back-outline" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: typography.title, color: colors.text, fontWeight: '900', letterSpacing: -0.8 },
  subtitle: { fontSize: typography.body, lineHeight: 22, color: colors.mutedText, fontWeight: '600' },
  customerCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: { width: 48, height: 48, borderRadius: radii.full, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.text, fontWeight: '900' },
  flex: { flex: 1 },
  label: { fontSize: typography.small, color: colors.mutedText, fontWeight: '800' },
  value: { marginTop: 2, fontSize: typography.h3, color: colors.text, fontWeight: '900' },
  body: { fontSize: typography.body, lineHeight: 22, color: colors.mutedText, fontWeight: '600' },
  linkCard: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start', backgroundColor: colors.blueSoft },
  link: { marginTop: 3, fontSize: typography.small, color: colors.blue, fontWeight: '900' },
  messageCard: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  icon: { width: 44, height: 44, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.blueSoft },
  row: { flexDirection: 'row', gap: spacing.sm },
  rowButton: { flex: 1 },
});
