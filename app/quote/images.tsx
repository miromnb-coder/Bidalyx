import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { colors, spacing, typography } from '../../src/constants/theme';
import { uploadQuoteImage } from '../../src/services/remoteData';
import { useQuotes } from '../../src/state/QuoteContext';

export default function QuoteImagesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getQuoteById, refreshRemote } = useQuotes();
  const quote = getQuoteById(id);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function addImage() {
    const picker = require('expo-image-picker');
    const permission = await picker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setMessage('Anna sovellukselle lupa kuviin.');
      return;
    }

    const result = await picker.launchImageLibraryAsync({ mediaTypes: picker.MediaTypeOptions.Images, quality: 0.82 });
    if (result.canceled || !result.assets?.[0] || !id) return;

    setBusy(true);
    try {
      const asset = result.assets[0];
      await uploadQuoteImage(id, {
        uri: asset.uri,
        fileName: asset.fileName ?? `quote-${Date.now()}.jpg`,
        mimeType: asset.mimeType ?? 'image/jpeg',
        fileSize: asset.fileSize ?? null,
      });
      await refreshRemote();
      setMessage('Kuva tallennettiin Supabase Storageen.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Kuvan tallennus epäonnistui.');
    } finally {
      setBusy(false);
    }
  }

  if (!quote) return <Screen><Text style={styles.title}>Tarjousta ei löytynyt</Text></Screen>;

  return (
    <Screen>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </Pressable>
      <Text style={styles.title}>Tarjouksen kuvat</Text>
      <Text style={styles.subtitle}>{quote.jobTitle}</Text>
      <Card><Text style={styles.body}>Tässä tarjouksessa on {quote.imageCount} kuvaa.</Text></Card>
      {message ? <Card><Text style={styles.body}>{message}</Text></Card> : null}
      <Button title={busy ? 'Tallennetaan...' : 'Valitse kuva puhelimesta'} icon="image-outline" onPress={addImage} disabled={busy} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: { width: 44, height: 44, justifyContent: 'center', marginLeft: -spacing.sm },
  title: { fontSize: typography.title, fontWeight: '900', color: colors.text },
  subtitle: { fontSize: typography.body, color: colors.mutedText, fontWeight: '600' },
  body: { fontSize: typography.body, lineHeight: 22, color: colors.mutedText, fontWeight: '600' },
});
