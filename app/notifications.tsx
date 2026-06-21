import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '../src/components/Button';
import { Card } from '../src/components/Card';
import { Screen } from '../src/components/Screen';
import { colors, radii, spacing, typography } from '../src/constants/theme';
import { useQuotes } from '../src/state/QuoteContext';
import { formatCurrency } from '../src/utils/formatCurrency';

export default function NotificationsScreen() {
  const { quotes, refreshRemote, syncLoading } = useQuotes();
  const reminders = quotes.filter((quote) => ['sent', 'opened', 'waiting'].includes(quote.status));
  const accepted = quotes.filter((quote) => quote.status === 'accepted').slice(0, 5);
  const drafts = quotes.filter((quote) => quote.status === 'draft').slice(0, 5);

  return (
    <Screen>
      <Pressable onPress={() => router.back()} style={styles.backButton}><Ionicons name="arrow-back" size={24} color={colors.text} /></Pressable>
      <Text style={styles.title}>Ilmoitukset</Text>
      <Text style={styles.subtitle}>Avoimet seurannat, hyväksynnät ja luonnokset yhdessä paikassa.</Text>
      <Button title={syncLoading ? 'Päivitetään...' : 'Päivitä ilmoitukset'} icon="refresh-outline" onPress={refreshRemote} disabled={syncLoading} />

      <Card style={styles.summaryCard}>
        <View style={styles.summaryItem}><Text style={styles.summaryValue}>{reminders.length}</Text><Text style={styles.summaryLabel}>Muistutettavaa</Text></View>
        <View style={styles.summaryItem}><Text style={styles.summaryValue}>{accepted.length}</Text><Text style={styles.summaryLabel}>Hyväksytty</Text></View>
        <View style={styles.summaryItem}><Text style={styles.summaryValue}>{drafts.length}</Text><Text style={styles.summaryLabel}>Luonnosta</Text></View>
      </Card>

      <Text style={styles.section}>Muistutettavat tarjoukset</Text>
      {reminders.length ? reminders.map((quote) => <Pressable key={quote.id} onPress={() => router.push(`/quote/${quote.id}`)}><Card style={styles.notification}><View style={styles.icon}><Ionicons name="notifications-outline" size={20} color={colors.orange} /></View><View style={styles.flex}><Text style={styles.name}>{quote.customerName}</Text><Text style={styles.body}>{quote.jobTitle} · {formatCurrency(quote.estimatedValue)}</Text><Text style={styles.meta}>Status: {quote.status}</Text></View></Card></Pressable>) : <Card><Text style={styles.body}>Ei muistutettavia tarjouksia juuri nyt.</Text></Card>}

      <Text style={styles.section}>Hyväksytyt</Text>
      {accepted.length ? accepted.map((quote) => <Pressable key={quote.id} onPress={() => router.push(`/quote/${quote.id}`)}><Card style={styles.notification}><View style={styles.greenIcon}><Ionicons name="checkmark-circle-outline" size={20} color={colors.green} /></View><View style={styles.flex}><Text style={styles.name}>{quote.customerName}</Text><Text style={styles.body}>{quote.jobTitle} · {formatCurrency(quote.estimatedValue)}</Text></View></Card></Pressable>) : <Card><Text style={styles.body}>Ei uusia hyväksyntöjä.</Text></Card>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: { width: 44, height: 44, justifyContent: 'center', marginLeft: -spacing.sm },
  title: { fontSize: typography.title, color: colors.text, fontWeight: '900' },
  subtitle: { fontSize: typography.body, color: colors.mutedText, lineHeight: 22, fontWeight: '600' },
  summaryCard: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'space-between' },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryValue: { fontSize: typography.h2, color: colors.text, fontWeight: '900' },
  summaryLabel: { fontSize: typography.tiny, color: colors.mutedText, fontWeight: '800', textAlign: 'center' },
  section: { fontSize: typography.h3, color: colors.text, fontWeight: '900', marginTop: spacing.sm },
  notification: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  icon: { width: 42, height: 42, borderRadius: radii.full, backgroundColor: colors.orangeSoft, alignItems: 'center', justifyContent: 'center' },
  greenIcon: { width: 42, height: 42, borderRadius: radii.full, backgroundColor: colors.greenSoft, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
  name: { fontSize: typography.body, color: colors.text, fontWeight: '900' },
  body: { fontSize: typography.body, lineHeight: 22, color: colors.mutedText, fontWeight: '600' },
  meta: { fontSize: typography.tiny, color: colors.subtleText, fontWeight: '800' },
});
