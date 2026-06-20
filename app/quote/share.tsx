import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Share, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { colors, radii, spacing, typography } from '../../src/constants/theme';
import { useQuotes } from '../../src/state/QuoteContext';

export default function ShareQuoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getQuoteById, markQuoteSent, buildPublicShareLink } = useQuotes();
  const quote = getQuoteById(id);

  if (!quote) return <Screen><Text style={styles.title}>Tarjousta ei löytynyt</Text></Screen>;

  const link = buildPublicShareLink(quote);

  async function shareLink() {
    await markQuoteSent(quote.id);
    await Share.share({ message: `Hei! Tässä tarjouksesi: ${link}` });
  }

  return (
    <Screen>
      <Text style={styles.title}>Jaa tarjouslinkki</Text>
      <Text style={styles.subtitle}>Tämä linkki avaa asiakkaalle oikean Supabase Edge Function -verkkonäkymän.</Text>
      <Card style={styles.linkCard}>
        <View style={styles.icon}><Ionicons name="link-outline" size={26} color={colors.blue} /></View>
        <View style={styles.flex}>
          <Text style={styles.label}>Asiakkaan julkinen linkki</Text>
          <Text style={styles.link}>{link}</Text>
        </View>
      </Card>
      <Card style={styles.infoCard}>
        <Ionicons name="shield-checkmark-outline" size={22} color={colors.green} />
        <Text style={styles.infoText}>Asiakas näkee vain tarjouksen julkiset tiedot. Sisäiset muistiinpanot ja yrityksen hallintatiedot eivät näy linkissä.</Text>
      </Card>
      <Button title="Jaa linkki" icon="share-outline" onPress={shareLink} />
      <Button title="Avaa sovelluksen esikatselu" variant="secondary" icon="eye-outline" onPress={() => router.push({ pathname: '/quote/customer-preview', params: { id: quote.id } })} />
      <Button title="Palaa tarjoukseen" variant="ghost" icon="arrow-back-outline" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: typography.h1, fontWeight: '900', color: colors.text },
  subtitle: { fontSize: typography.body, lineHeight: 22, color: colors.mutedText, fontWeight: '600' },
  linkCard: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  icon: { width: 48, height: 48, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.blueSoft },
  flex: { flex: 1 },
  label: { fontSize: typography.small, color: colors.mutedText, fontWeight: '800' },
  link: { marginTop: 4, fontSize: typography.small, lineHeight: 20, color: colors.blue, fontWeight: '900' },
  infoCard: { flexDirection: 'row', gap: spacing.md, backgroundColor: colors.greenSoft },
  infoText: { flex: 1, fontSize: typography.small, lineHeight: 20, color: colors.text, fontWeight: '700' },
});
