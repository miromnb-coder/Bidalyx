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

  if (!customer) {
    return <Screen><Text style={styles.title}>Asiakasta ei löytynyt</Text></Screen>;
  }

  return (
    <Screen>
      <Pressable onPress={() => router.back()} style={styles.backButton}><Ionicons name="arrow-back" size={24} color={colors.text} /></Pressable>
      <Card style={styles.hero}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{customer.name.slice(0, 2).toUpperCase()}</Text></View>
        <Text style={styles.title}>{customer.name}</Text>
        <Text style={styles.subtitle}>{customer.phone ?? 'Ei puhelinta'} · {customer.email ?? 'Ei sähköpostia'}</Text>
      </Card>
      <View style={styles.statsRow}>
        <Card style={styles.stat}><Text style={styles.statValue}>{customer.quotesCount}</Text><Text style={styles.statLabel}>Tarjousta</Text></Card>
        <Card style={styles.stat}><Text style={styles.statValue}>{formatCurrency(customer.totalValue)}</Text><Text style={styles.statLabel}>Kokonaisarvo</Text></Card>
      </View>
      <Button title="Luo uusi tarjous" icon="add" onPress={() => router.push('/(tabs)/create')} />
      <Text style={styles.sectionTitle}>Asiakkaan tarjoukset</Text>
      {quotes.map((quote) => <QuoteCard key={quote.id} quote={quote} onPress={() => router.push(`/quote/${quote.id}`)} />)}
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
  statsRow: { flexDirection: 'row', gap: spacing.sm },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: typography.h3, color: colors.text, fontWeight: '900' },
  statLabel: { marginTop: 2, fontSize: typography.tiny, color: colors.mutedText, fontWeight: '800' },
  sectionTitle: { fontSize: typography.h3, fontWeight: '900', color: colors.text, marginTop: spacing.sm },
});
