import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { Button } from '../src/components/Button';
import { Card } from '../src/components/Card';
import { Screen } from '../src/components/Screen';
import { colors, spacing, typography } from '../src/constants/theme';
import { useQuotes } from '../src/state/QuoteContext';

export default function SubscriptionsScreen() {
  const { quotes, attachments } = useQuotes();
  return (
    <Screen>
      <Text style={styles.title}>Paketit</Text>
      <Text style={styles.text}>Nykyinen käyttö: {quotes.length} tarjousta ja {attachments.length} kuvaa.</Text>
      <Card><Text style={styles.name}>Starter</Text><Text style={styles.text}>49 kuukaudessa. Perustoiminnot, tarjouslinkit, dokumenttinäkymä ja dashboard.</Text></Card>
      <Card><Text style={styles.name}>Pro</Text><Text style={styles.text}>99 kuukaudessa. CRM, tarjouspohjat, viestipohjat ja muistutukset.</Text></Card>
      <Card><Text style={styles.name}>Business</Text><Text style={styles.text}>199 kuukaudessa. Tiimikäyttö, suuremmat rajat ja laajempi analytiikka.</Text></Card>
      <Button title="Palaa" variant="ghost" icon="arrow-back-outline" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: typography.title, color: colors.text, fontWeight: '900' },
  name: { fontSize: typography.h3, color: colors.text, fontWeight: '900' },
  text: { marginTop: spacing.xs, fontSize: typography.body, lineHeight: 22, color: colors.mutedText, fontWeight: '600' },
});
