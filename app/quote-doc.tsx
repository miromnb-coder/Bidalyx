import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../src/components/Button';
import { Card } from '../src/components/Card';
import { Screen } from '../src/components/Screen';
import { colors, spacing, typography } from '../src/constants/theme';
import { useQuotes } from '../src/state/QuoteContext';
import { formatCurrency } from '../src/utils/formatCurrency';

export default function QuoteDocScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getQuoteById, company, buildPublicShareLink } = useQuotes();
  const quote = getQuoteById(id);

  if (!quote) {
    return (
      <Screen>
        <Text style={styles.title}>Tarjousta ei löytynyt</Text>
        <Button title="Palaa" variant="ghost" icon="arrow-back-outline" onPress={() => router.back()} />
      </Screen>
    );
  }

  const link = buildPublicShareLink(quote);

  return (
    <Screen>
      <Text style={styles.title}>Tarjousdokumentti</Text>
      <Text style={styles.subtitle}>PDF-tyylinen näkymä tarjouksesta.</Text>

      <Card style={styles.paper}>
        <View style={styles.headerRow}>
          <View style={styles.flex}>
            <Text style={styles.company}>{company.name}</Text>
            <Text style={styles.muted}>{company.email} · {company.phone}</Text>
            <Text style={styles.muted}>{company.website}</Text>
          </View>
          <View style={styles.badge}><Text style={styles.badgeText}>TARJOUS</Text></View>
        </View>

        <View style={styles.line} />

        <Text style={styles.label}>Tarjous asiakkaalle</Text>
        <Text style={styles.heading}>{quote.jobTitle}</Text>
        <Text style={styles.muted}>Asiakas: {quote.customerName}</Text>
        <Text style={styles.muted}>Voimassa: {quote.validUntil}</Text>

        <Card style={styles.priceCard}>
          <Text style={styles.priceLabel}>Tarjouksen arvo</Text>
          <Text style={styles.price}>{formatCurrency(quote.estimatedValue)}</Text>
        </Card>

        <Text style={styles.section}>Työn kuvaus</Text>
        <Text style={styles.body}>{quote.description}</Text>

        <Text style={styles.section}>Sisältää</Text>
        {quote.includedItems.map((item) => <Text key={item} style={styles.body}>• {item}</Text>)}

        <Text style={styles.section}>Aikataulu</Text>
        <Text style={styles.body}>{quote.schedule || 'Sovitaan erikseen'}</Text>

        <Text style={styles.section}>Ehdot</Text>
        <Text style={styles.body}>{quote.terms || 'Lopullinen hinta vahvistetaan ennen työn aloitusta.'}</Text>

        <View style={styles.linkBox}>
          <Text style={styles.priceLabel}>Asiakkaan linkki</Text>
          <Text style={styles.link}>{link}</Text>
        </View>
      </Card>

      <Button title="Palaa tarjoukseen" variant="ghost" icon="arrow-back-outline" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: typography.title, fontWeight: '900', color: colors.text },
  subtitle: { fontSize: typography.body, color: colors.mutedText, fontWeight: '600', lineHeight: 22 },
  paper: { gap: spacing.sm, padding: spacing.lg },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  flex: { flex: 1 },
  company: { fontSize: typography.h3, fontWeight: '900', color: colors.text },
  muted: { fontSize: typography.small, color: colors.mutedText, fontWeight: '600' },
  badge: { paddingHorizontal: spacing.sm, paddingVertical: 7, borderRadius: 999, backgroundColor: colors.blueSoft },
  badgeText: { fontSize: typography.tiny, color: colors.blue, fontWeight: '900' },
  line: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
  label: { fontSize: typography.tiny, color: colors.blue, fontWeight: '900', textTransform: 'uppercase' },
  heading: { fontSize: typography.h1, color: colors.text, fontWeight: '900' },
  priceCard: { marginTop: spacing.md, backgroundColor: colors.background },
  priceLabel: { fontSize: typography.tiny, color: colors.mutedText, fontWeight: '900', textTransform: 'uppercase' },
  price: { marginTop: 4, fontSize: 34, color: colors.text, fontWeight: '900' },
  section: { marginTop: spacing.md, fontSize: typography.body, color: colors.text, fontWeight: '900' },
  body: { fontSize: typography.body, lineHeight: 22, color: colors.mutedText, fontWeight: '600' },
  linkBox: { marginTop: spacing.md, padding: spacing.md, borderRadius: 18, backgroundColor: colors.blueSoft },
  link: { marginTop: 4, fontSize: typography.tiny, color: colors.blue, fontWeight: '800' },
});
