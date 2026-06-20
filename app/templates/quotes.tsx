import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { colors, radii, spacing, typography } from '../../src/constants/theme';
import { useQuotes } from '../../src/state/QuoteContext';
import { formatCurrency } from '../../src/utils/formatCurrency';

export default function QuoteTemplatesScreen() {
  const { quoteTemplates } = useQuotes();

  return (
    <Screen>
      <Pressable onPress={() => router.back()} style={styles.backButton}><Ionicons name="arrow-back" size={24} color={colors.text} /></Pressable>
      <Text style={styles.title}>Tarjouspohjat</Text>
      <Text style={styles.subtitle}>Valmiit pohjat nopeuttavat tarjouksen tekemistä.</Text>
      {quoteTemplates.length ? quoteTemplates.map((template) => (
        <Card key={template.id} style={styles.card}>
          <View style={styles.topRow}><View style={styles.icon}><Ionicons name="document-text-outline" size={22} color={colors.blue} /></View><View style={styles.flex}><Text style={styles.name}>{template.name}</Text><Text style={styles.meta}>{template.defaultSchedule} · {formatCurrency(template.basePrice)}</Text></View></View>
          <Text style={styles.body}>{template.descriptionTemplate}</Text>
          {template.includedItems.map((item) => <Text key={item} style={styles.item}>• {item}</Text>)}
        </Card>
      )) : <Card><Text style={styles.body}>Pohjia ei vielä löytynyt. Ne luodaan automaattisesti Supabase-synkronoinnin yhteydessä.</Text></Card>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: { width: 44, height: 44, justifyContent: 'center', marginLeft: -spacing.sm },
  title: { fontSize: typography.title, color: colors.text, fontWeight: '900' },
  subtitle: { fontSize: typography.body, color: colors.mutedText, fontWeight: '600', lineHeight: 22 },
  card: { gap: spacing.sm },
  topRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  icon: { width: 44, height: 44, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.blueSoft },
  flex: { flex: 1 },
  name: { fontSize: typography.h3, color: colors.text, fontWeight: '900' },
  meta: { fontSize: typography.small, color: colors.mutedText, fontWeight: '700' },
  body: { fontSize: typography.body, lineHeight: 22, color: colors.mutedText, fontWeight: '600' },
  item: { fontSize: typography.small, color: colors.text, fontWeight: '700' },
});
