import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { colors, radii, spacing, typography } from '../../src/constants/theme';
import { useQuotes } from '../../src/state/QuoteContext';

export default function MessageTemplatesScreen() {
  const { messageTemplates } = useQuotes();

  return (
    <Screen>
      <Pressable onPress={() => router.back()} style={styles.backButton}><Ionicons name="arrow-back" size={24} color={colors.text} /></Pressable>
      <Text style={styles.title}>Viestipohjat</Text>
      <Text style={styles.subtitle}>Näitä käytetään lähetys- ja muistutusviesteissä.</Text>
      {messageTemplates.length ? messageTemplates.map((template) => (
        <Card key={template.id} style={styles.card}>
          <View style={styles.topRow}><View style={styles.icon}><Ionicons name="chatbubble-ellipses-outline" size={22} color={colors.blue} /></View><View style={styles.flex}><Text style={styles.name}>{template.subject ?? template.type}</Text><Text style={styles.meta}>{template.type}</Text></View></View>
          <Text style={styles.body}>{template.body}</Text>
        </Card>
      )) : <Card><Text style={styles.body}>Viestipohjia ei vielä löytynyt. Ne luodaan automaattisesti Supabase-synkronoinnin yhteydessä.</Text></Card>}
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
});
