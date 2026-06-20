import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { colors, radii, spacing, typography } from '../../src/constants/theme';
import { useQuotes } from '../../src/state/QuoteContext';
import { formatCurrency } from '../../src/utils/formatCurrency';

export default function AcceptedScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getQuoteById, company } = useQuotes();
  const quote = getQuoteById(id);

  return (
    <Screen>
      <Card style={styles.hero}>
        <View style={styles.icon}><Ionicons name="checkmark" size={40} color={colors.card} /></View>
        <Text style={styles.title}>Tarjous hyväksytty</Text>
        <Text style={styles.subtitle}>Yritys ottaa asiakkaaseen yhteyttä seuraavaksi.</Text>
      </Card>
      {quote ? <Card><Text style={styles.job}>{quote.jobTitle}</Text><Text style={styles.price}>{formatCurrency(quote.estimatedValue)}</Text><Text style={styles.body}>{quote.customerName} · {quote.location}</Text></Card> : null}
      <Card><Text style={styles.job}>{company.name}</Text><Text style={styles.body}>{company.phone}</Text><Text style={styles.body}>{company.email}</Text></Card>
      <Button title="Palaa etusivulle" icon="home-outline" onPress={() => router.replace('/(tabs)/home')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: spacing.sm, padding: spacing.xl },
  icon: { width: 72, height: 72, borderRadius: radii.full, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: typography.h1, color: colors.text, fontWeight: '900', textAlign: 'center' },
  subtitle: { fontSize: typography.body, color: colors.mutedText, fontWeight: '600', textAlign: 'center' },
  job: { fontSize: typography.h3, color: colors.text, fontWeight: '900' },
  price: { marginTop: spacing.xs, fontSize: typography.title, color: colors.text, fontWeight: '900' },
  body: { marginTop: spacing.xs, fontSize: typography.body, color: colors.mutedText, fontWeight: '600' },
});
