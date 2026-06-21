import { router, useLocalSearchParams } from 'expo-router';
import { Share, StyleSheet, Text, View } from 'react-native';

import { Button } from '../src/components/Button';
import { Card } from '../src/components/Card';
import { Screen } from '../src/components/Screen';
import { colors, radii, spacing, typography } from '../src/constants/theme';
import { useQuotes } from '../src/state/QuoteContext';
import { formatCurrency } from '../src/utils/formatCurrency';

export default function QuoteDocScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getQuoteById, company, buildPublicShareLink } = useQuotes();
  const quote = getQuoteById(id);

  if (!quote) {
    return <Screen><Text style={styles.title}>Tarjousta ei löytynyt</Text><Button title="Palaa" variant="ghost" icon="arrow-back-outline" onPress={() => router.back()} /></Screen>;
  }

  const link = buildPublicShareLink(quote);
  const shareText = `${company.name}\nTarjous: ${quote.jobTitle}\nAsiakas: ${quote.customerName}\nHinta: ${formatCurrency(quote.estimatedValue)}\n\n${quote.description}\n\n${link}`;

  return (
    <Screen>
      <Text style={styles.title}>Tarjousdokumentti</Text>
      <Text style={styles.subtitle}>PDF-tyylinen esikatselu, joka näyttää samalta kuin asiakkaalle lähetettävä tarjouspaperi.</Text>

      <Card style={styles.paper}>
        <View style={styles.headerRow}><View style={styles.flex}><Text style={styles.company}>{company.name}</Text><Text style={styles.muted}>{company.businessId || 'Y-tunnus puuttuu'}</Text><Text style={styles.muted}>{company.email} · {company.phone}</Text><Text style={styles.muted}>{company.website}</Text></View><View style={styles.badge}><Text style={styles.badgeText}>TARJOUS</Text></View></View>
        <View style={styles.line} />
        <Text style={styles.label}>Tarjous asiakkaalle</Text>
        <Text style={styles.heading}>{quote.jobTitle}</Text>
        <Text style={styles.muted}>Asiakas: {quote.customerName}</Text>
        <Text style={styles.muted}>Voimassa: {quote.validUntil}</Text>
        <View style={styles.priceCard}><Text style={styles.priceLabel}>Tarjouksen arvo</Text><Text style={styles.price}>{formatCurrency(quote.estimatedValue)}</Text></View>
        <Text style={styles.section}>Työn kuvaus</Text><Text style={styles.body}>{quote.description}</Text>
        <Text style={styles.section}>Sisältää</Text>{quote.includedItems.map((item) => <Text key={item} style={styles.listItem}>• {item}</Text>)}
        <Text style={styles.section}>Aikataulu</Text><Text style={styles.body}>{quote.schedule || 'Sovitaan erikseen'}</Text>
        <Text style={styles.section}>Ehdot</Text><Text style={styles.body}>{quote.terms || 'Lopullinen hinta vahvistetaan ennen työn aloitusta.'}</Text>
        <View style={styles.linkBox}><Text style={styles.priceLabel}>Asiakkaan hyväksyntälinkki</Text><Text style={styles.link}>{link}</Text></View>
      </Card>

      <Button title="Jaa dokumentin teksti" icon="share-outline" onPress={() => Share.share({ message: shareText })} />
      <Button title="Palaa tarjoukseen" variant="ghost" icon="arrow-back-outline" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: typography.title, fontWeight: '900', color: colors.text, letterSpacing: -0.8 },
  subtitle: { fontSize: typography.body, color: colors.mutedText, fontWeight: '600', lineHeight: 22 },
  paper: { gap: spacing.sm, padding: spacing.xl, borderRadius: radii.xl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md, alignItems: 'flex-start' },
  flex: { flex: 1 },
  company: { fontSize: typography.h3, fontWeight: '900', color: colors.text },
  muted: { fontSize: typography.small, color: colors.mutedText, fontWeight: '600', lineHeight: 20 },
  badge: { paddingHorizontal: spacing.sm, paddingVertical: 7, borderRadius: radii.full, backgroundColor: colors.blueSoft, borderWidth: 1, borderColor: '#DBEAFE' },
  badgeText: { fontSize: typography.tiny, color: colors.blue, fontWeight: '900' },
  line: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
  label: { fontSize: typography.tiny, color: colors.blue, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.3 },
  heading: { fontSize: typography.h1, color: colors.text, fontWeight: '900', letterSpacing: -0.6 },
  priceCard: { marginTop: spacing.md, padding: spacing.md, borderRadius: radii.lg, backgroundColor: colors.background },
  priceLabel: { fontSize: typography.tiny, color: colors.mutedText, fontWeight: '900', textTransform: 'uppercase' },
  price: { marginTop: 4, fontSize: 38, color: colors.text, fontWeight: '900', letterSpacing: -1 },
  section: { marginTop: spacing.md, fontSize: typography.body, color: colors.text, fontWeight: '900' },
  body: { fontSize: typography.body, lineHeight: 22, color: colors.mutedText, fontWeight: '600' },
  listItem: { fontSize: typography.body, lineHeight: 24, color: colors.mutedText, fontWeight: '700' },
  linkBox: { marginTop: spacing.md, padding: spacing.md, borderRadius: radii.lg, backgroundColor: colors.blueSoft, borderWidth: 1, borderColor: '#DBEAFE' },
  link: { marginTop: 4, fontSize: typography.tiny, color: colors.blue, fontWeight: '800' },
});
