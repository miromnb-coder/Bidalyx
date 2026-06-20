import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { StatusBadge } from '../../src/components/StatusBadge';
import { colors, spacing, typography } from '../../src/constants/theme';
import { useQuotes } from '../../src/state/QuoteContext';
import { formatCurrency } from '../../src/utils/formatCurrency';

export default function QuoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getQuoteById, buildShareLink } = useQuotes();
  const quote = getQuoteById(id);

  if (!quote) return <Screen><Text style={styles.title}>Tarjousta ei löytynyt</Text></Screen>;

  return (
    <Screen>
      <Pressable onPress={() => router.back()} style={styles.back}><Ionicons name="arrow-back" size={24} color={colors.text} /></Pressable>
      <Text style={styles.title}>{quote.jobTitle}</Text>
      <Text style={styles.sub}>{quote.customerName} · {quote.location}</Text>
      <StatusBadge status={quote.status} />
      <Card><Text style={styles.label}>Arvo</Text><Text style={styles.price}>{formatCurrency(quote.estimatedValue)}</Text><Text style={styles.link}>{buildShareLink(quote)}</Text></Card>
      <Card><Text style={styles.label}>Työn kuvaus</Text><Text style={styles.body}>{quote.description}</Text></Card>
      <Card><Text style={styles.label}>Asiakkaan viesti</Text><Text style={styles.body}>{quote.customerMessage}</Text></Card>
      <Card><Text style={styles.label}>Liitteet</Text><Text style={styles.body}>{quote.imageCount} liitettä</Text></Card>
      <Button title="Muokkaa tarjousta" variant="secondary" icon="create-outline" onPress={() => router.push({ pathname: '/quote/edit', params: { id: quote.id } })} />
      <Button title="Hallitse liitteitä" variant="secondary" icon="attach-outline" onPress={() => router.push({ pathname: '/quote/images', params: { id: quote.id } })} />
      <Button title="Lähetä tarjous" icon="paper-plane-outline" onPress={() => router.push({ pathname: '/quote/send', params: { id: quote.id } })} />
      <Button title="Jaa linkki" variant="ghost" icon="share-outline" onPress={() => router.push({ pathname: '/quote/share', params: { id: quote.id } })} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { width: 44, height: 44, justifyContent: 'center', marginLeft: -spacing.sm },
  title: { fontSize: typography.h1, fontWeight: '900', color: colors.text },
  sub: { fontSize: typography.body, color: colors.mutedText, fontWeight: '700' },
  label: { fontSize: typography.body, color: colors.text, fontWeight: '900' },
  price: { fontSize: typography.title, fontWeight: '900', color: colors.text },
  link: { fontSize: typography.tiny, color: colors.blue, fontWeight: '800' },
  body: { fontSize: typography.body, lineHeight: 22, color: colors.mutedText, fontWeight: '600' },
});
