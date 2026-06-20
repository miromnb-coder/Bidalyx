import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '../../src/components/AppHeader';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { colors, radii, spacing, typography } from '../../src/constants/theme';
import { useQuotes } from '../../src/state/QuoteContext';
import { formatCurrency } from '../../src/utils/formatCurrency';

export default function CustomersScreen() {
  const { customers } = useQuotes();

  return (
    <Screen>
      <AppHeader title="Asiakkaat" subtitle="Kevyt CRM tarjousten pohjalta" />
      {customers.map((customer) => (
        <Pressable key={customer.id} onPress={() => router.push(`/customer/${customer.id}`)}>
          <Card style={styles.card}>
            <View style={styles.topRow}>
              <View style={styles.avatar}><Text style={styles.avatarText}>{customer.name.slice(0, 2).toUpperCase()}</Text></View>
              <View style={styles.textWrap}><Text style={styles.name}>{customer.name}</Text><Text style={styles.job}>{customer.latestJob}</Text></View>
              <Ionicons name="chevron-forward" size={20} color={colors.subtleText} />
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>{customer.quotesCount} tarjousta · {customer.acceptedQuotesCount} hyväksytty</Text>
              <Text style={styles.value}>{formatCurrency(customer.totalValue)}</Text>
            </View>
          </Card>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: { width: 46, height: 46, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  avatarText: { color: colors.text, fontWeight: '900' },
  textWrap: { flex: 1 },
  name: { fontSize: typography.h3, fontWeight: '900', color: colors.text },
  job: { marginTop: 2, fontSize: typography.small, fontWeight: '700', color: colors.mutedText },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  meta: { flex: 1, fontSize: typography.small, fontWeight: '700', color: colors.mutedText },
  value: { fontSize: typography.body, fontWeight: '900', color: colors.green },
});
