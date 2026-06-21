import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '../src/components/Card';
import { Screen } from '../src/components/Screen';
import { colors, radii, spacing, typography } from '../src/constants/theme';
import { useQuotes } from '../src/state/QuoteContext';

const plans = [
  { name: 'Starter', price: '49 €/kk', highlight: false, limits: ['50 tarjousta / kk', '250 kuvaa', '1 käyttäjä'], features: ['Tarjoukset', 'Public link', 'Dokumenttinäkymä', 'Perusdashboard'] },
  { name: 'Pro', price: '99 €/kk', highlight: true, limits: ['300 tarjousta / kk', '2000 kuvaa', '5 käyttäjää'], features: ['CRM', 'Tarjouspohjat', 'Viestipohjat', 'Muistutukset'] },
  { name: 'Business', price: '199 €/kk', highlight: false, limits: ['Rajaton tarjousmäärä', 'Rajaton kuvamäärä', '20 käyttäjää'], features: ['Tiimikäyttö', 'Laaja analytiikka', 'Korkeammat rajat', 'Premium-tuki'] },
];

export default function PricingScreen() {
  const { quotes, attachments } = useQuotes();
  return (
    <Screen>
      <Pressable onPress={() => router.back()} style={styles.backButton}><Ionicons name="arrow-back" size={24} color={colors.text} /></Pressable>
      <Text style={styles.title}>SaaS-paketit</Text>
      <Text style={styles.subtitle}>Paketit ja käyttömäärät Bidalyxin maksullista versiota varten.</Text>
      <Card style={styles.usageCard}><Text style={styles.cardTitle}>Nykyinen käyttö</Text><View style={styles.usageRow}><Text style={styles.body}>{quotes.length} tarjousta</Text><Text style={styles.body}>{attachments.length} kuvaa/liitettä</Text></View></Card>
      {plans.map((plan) => <Card key={plan.name} style={[styles.planCard, plan.highlight && styles.highlightCard]}><View style={styles.planTop}><View><Text style={styles.name}>{plan.name}</Text><Text style={styles.body}>{plan.highlight ? 'Suositeltu pienyritykselle' : 'Kasvavaan käyttöön'}</Text></View><Text style={styles.price}>{plan.price}</Text></View><View style={styles.limitRow}>{plan.limits.map((limit) => <View key={limit} style={styles.limitPill}><Text style={styles.limitText}>{limit}</Text></View>)}</View>{plan.features.map((feature) => <View key={feature} style={styles.featureRow}><Ionicons name="checkmark-circle-outline" size={18} color={colors.green} /><Text style={styles.featureText}>{feature}</Text></View>)}</Card>)}
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: { width: 44, height: 44, justifyContent: 'center', marginLeft: -spacing.sm },
  title: { fontSize: typography.title, color: colors.text, fontWeight: '900', letterSpacing: -0.8 },
  subtitle: { fontSize: typography.body, lineHeight: 22, color: colors.mutedText, fontWeight: '600' },
  usageCard: { gap: spacing.sm, backgroundColor: colors.blueSoft, borderColor: '#DBEAFE' },
  cardTitle: { fontSize: typography.h3, color: colors.text, fontWeight: '900' },
  usageRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  body: { fontSize: typography.body, lineHeight: 22, color: colors.mutedText, fontWeight: '600' },
  planCard: { gap: spacing.md },
  highlightCard: { borderWidth: 2, borderColor: colors.blue },
  planTop: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  name: { fontSize: typography.h2, color: colors.text, fontWeight: '900' },
  price: { fontSize: typography.h3, color: colors.blue, fontWeight: '900' },
  limitRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  limitPill: { paddingHorizontal: spacing.sm, paddingVertical: 8, borderRadius: radii.full, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  limitText: { fontSize: typography.tiny, color: colors.mutedText, fontWeight: '900' },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  featureText: { fontSize: typography.body, color: colors.text, fontWeight: '700' },
});
