import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Share, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { colors, spacing, typography } from '../../src/constants/theme';
import { useQuotes } from '../../src/state/QuoteContext';

export default function ShareQuoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getQuoteById, buildShareLink, markQuoteSent } = useQuotes();
  const quote = getQuoteById(id);

  if (!quote) {
    return <Screen><Text style={styles.title}>Tarjousta ei löytynyt</Text></Screen>;
  }

  const link = buildShareLink(quote);

  async function shareLink() {
    markQuoteSent(quote.id);
    await Share.share({ message: `Hei! Tässä tarjouksesi: ${link}` });
  }

  return (
    <Screen>
      <Text style={styles.title}>Jaa tarjouslinkki</Text>
      <Text style={styles.subtitle}>Ensimmäisessä MVP-versiossa linkki on demo-linkki. Backendin jälkeen siitä tulee oikea verkkolinkki.</Text>
      <Card style={styles.linkCard}>
        <View style={styles.icon}><Ionicons name="link-outline" size={26} color={colors.blue} /></View>
        <Text style={styles.link}>{link}</Text>
      </Card>
      <Button title="Jaa linkki" icon="share-outline" onPress={shareLink} />
      <Button title="Avaa asiakkaan näkymä" variant="secondary" icon="eye-outline" onPress={() => router.push({ pathname: '/quote/customer-preview', params: { id: quote.id } })} />
      <Button title="Palaa tarjoukseen" variant="ghost" icon="arrow-back-outline" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: typography.h1, fontWeight: '900', color: colors.text },
  subtitle: { fontSize: typography.body, lineHeight: 22, color: colors.mutedText, fontWeight: '600' },
  linkCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  icon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.blueSoft },
  link: { flex: 1, fontSize: typography.body, color: colors.blue, fontWeight: '800' },
});
