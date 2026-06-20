import { StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '../../src/components/AppHeader';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { colors, spacing, typography } from '../../src/constants/theme';
import { mockCustomers } from '../../src/data/mockCustomers';

export default function CustomersScreen() {
  return (
    <Screen>
      <AppHeader title="Asiakkaat" subtitle="Asiakashistoria ja tarjousarvot" />

      {mockCustomers.map((customer) => (
        <Card key={customer.id} style={styles.card}>
          <View>
            <Text style={styles.name}>{customer.name}</Text>
            <Text style={styles.job}>{customer.latestJob}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>{customer.quotesCount} tarjousta</Text>
            <Text style={styles.value}>{customer.totalValue} €</Text>
          </View>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  name: {
    fontSize: typography.h3,
    fontWeight: '900',
    color: colors.text,
  },
  job: {
    marginTop: 2,
    fontSize: typography.small,
    fontWeight: '700',
    color: colors.mutedText,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meta: {
    fontSize: typography.small,
    fontWeight: '700',
    color: colors.mutedText,
  },
  value: {
    fontSize: typography.body,
    fontWeight: '900',
    color: colors.green,
  },
});
