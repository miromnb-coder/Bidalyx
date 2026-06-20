import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { colors, radii, spacing, typography } from '../../src/constants/theme';
import { useQuotes } from '../../src/state/QuoteContext';
import { formatCurrency } from '../../src/utils/formatCurrency';

export default function AcceptQuoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getQuoteById, acceptQuote } = useQuotes();
  const [checked, setChecked] = useState(false);
  const quote = getQuoteById(id);

  if (!quote) {
    return <Screen><Text style={styles.title}>Tarjousta ei löytynyt</Text></Screen>;
  }

  function confirm() {
    acceptQuote(quote.id);
    router.replace({ pathname: '/quote/accepted', params: { id: quote.id } });
  }

  return (
    <Screen>
      <Pressable onPress={() => router.back()} style={styles.backButton}><Ionicons name="arrow-back" size={24} color={colors.text} /></Pressable>
      <Text style={styles.title}>Hyväksy tarjous</Text>
      <Text style={styles.subtitle}>Vahvista, että haluat hyväksyä tarjouksen.</Text>
      <Card style={styles.card}><Text style={styles.job}>{quote.jobTitle}</Text><Text style={styles.price}>{formatCurrency(quote.estimatedValue)}</Text><Text style={styles.body}>{quote.customerName} · {quote.location}</Text></Card>
      <Pressable onPress={() => setChecked(!checked)} style={styles.checkBoxRow}>
        <View style={[styles.checkBox, checked && styles.checkBoxActive]}>{checked ? <Ionicons name="checkmark" size={18} color={colors.card} /> : null}</View>
        <Text style={styles.body}>Hyväksyn tarjouksen ehdot ja ymmärrän, että yritys ottaa minuun yhteyttä työn aloituksesta.</Text>
      </Pressable>
      <Button title="Vahvista hyväksyntä" icon="checkmark-circle-outline" onPress={confirm} disabled={!checked} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: { width: 44, height: 44, justifyContent: 'center', marginLeft: -spacing.sm },
  title: { fontSize: typography.h1, fontWeight: '900', color: colors.text },
  subtitle: { fontSize: typography.small, color: colors.mutedText, fontWeight: '600' },
  card: { gap: spacing.sm },
  job: { fontSize: typography.h2, fontWeight: '900', color: colors.text },
  price: { fontSize: typography.title, fontWeight: '900', color: colors.text },
  body: { flex: 1, fontSize: typography.body, lineHeight: 22, color: colors.mutedText, fontWeight: '600' },
  checkBoxRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start', padding: spacing.md, borderRadius: radii.xl, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  checkBox: { width: 28, height: 28, borderRadius: radii.sm, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  checkBoxActive: { backgroundColor: colors.black, borderColor: colors.black },
});
