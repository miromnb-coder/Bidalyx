import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '../../src/components/AppHeader';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { colors, radii, spacing, typography } from '../../src/constants/theme';
import { useQuotes } from '../../src/state/QuoteContext';
import { formatCurrency } from '../../src/utils/formatCurrency';

export default function CustomersScreen() {
  const { customers } = useQuotes();
  const totalValue = customers.reduce((sum, customer) => sum + customer.totalValue, 0);
  const openValue = customers.reduce((sum, customer) => sum + customer.totalValue - customer.acceptedValue, 0);

  return (
    <Screen>
      <AppHeader title="Asiakkaat" subtitle="Kevyt CRM tarjousten pohjalta" />
      <Card style={styles.summaryCard}><View style={styles.summaryItem}><Text style={styles.summaryValue}>{customers.length}</Text><Text style={styles.summaryLabel}>Asiakasta</Text></View><View style={styles.summaryItem}><Text style={styles.summaryValue}>{formatCurrency(totalValue)}</Text><Text style={styles.summaryLabel}>Kokonaisarvo</Text></View><View style={styles.summaryItem}><Text style={styles.summaryValue}>{formatCurrency(openValue)}</Text><Text style={styles.summaryLabel}>Avoin arvo</Text></View></Card>
      {customers.length ? customers.map((customer) => <Pressable key={customer.id} onPress={() => router.push(`/customer/${customer.id}`)}><Card style={styles.card}><View style={styles.topRow}><View style={styles.avatar}><Text style={styles.avatarText}>{customer.name.slice(0, 2).toUpperCase()}</Text></View><View style={styles.textWrap}><Text style={styles.name}>{customer.name}</Text><Text style={styles.job}>{customer.latestJob}</Text></View><Ionicons name="chevron-forward" size={20} color={colors.subtleText} /></View><View style={styles.metaRow}><Text style={styles.meta}>{customer.quotesCount} tarjousta · {customer.acceptedQuotesCount} hyväksytty</Text><Text style={styles.value}>{formatCurrency(customer.totalValue)}</Text></View></Card></Pressable>) : <Card style={styles.emptyCard}><Text style={styles.emptyTitle}>Ei asiakkaita vielä</Text><Text style={styles.emptyText}>Asiakkaat syntyvät automaattisesti, kun luot tarjouksia.</Text><Button title="Luo ensimmäinen tarjous" icon="add" onPress={() => router.push('/(tabs)/create')} /></Card>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  summaryCard: { minHeight: 100, flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.blueSoft, borderColor: '#DCE8FF' },
  summaryItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  summaryValue: { fontSize: 24, color: colors.text, fontWeight: '900' },
  summaryLabel: { marginTop: 2, fontSize: typography.small, color: colors.mutedText, fontWeight: '800', textAlign: 'center' },
  card: { gap: spacing.md, borderRadius: radii.xl },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: { width: 44, height: 44, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.black },
  avatarText: { color: colors.card, fontWeight: '900' },
  textWrap: { flex: 1 },
  name: { fontSize: typography.body, fontWeight: '900', color: colors.text },
  job: { marginTop: 2, fontSize: typography.small, fontWeight: '700', color: colors.mutedText },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md },
  meta: { flex: 1, fontSize: typography.small, fontWeight: '700', color: colors.mutedText },
  value: { fontSize: typography.body, fontWeight: '900', color: colors.green },
  emptyCard: { minHeight: 150, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  emptyTitle: { fontSize: typography.h3, color: colors.text, fontWeight: '900', textAlign: 'center' },
  emptyText: { fontSize: typography.small, color: colors.mutedText, fontWeight: '600', textAlign: 'center', lineHeight: 20 },
});
