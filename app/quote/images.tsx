import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { colors, radii, spacing, typography } from '../../src/constants/theme';
import { uploadQuoteImage } from '../../src/services/remoteData';
import { useQuotes } from '../../src/state/QuoteContext';

export default function QuoteImagesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getQuoteById, getAttachmentsByQuoteId, refreshRemote, syncLoading } = useQuotes();
  const quote = getQuoteById(id);
  const attachments = getAttachmentsByQuoteId(id);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function addImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setMessage('Anna sovellukselle lupa kuviin, jotta voit lisätä kuvia tarjoukseen.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.82,
      allowsEditing: false,
    });

    if (result.canceled || !result.assets?.[0] || !id) return;

    setBusy(true);
    setMessage('');
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

      <View>
        <Text style={styles.title}>Tarjouksen kuvat</Text>
        <Text style={styles.subtitle}>{quote.jobTitle} · {quote.customerName}</Text>
      </View>

      <Card style={styles.summaryCard}>
        <View style={styles.iconBubble}><Ionicons name="images-outline" size={24} color={colors.blue} /></View>
        <View style={styles.flex}>
          <Text style={styles.cardTitle}>{attachments.length} kuvaa tallennettu</Text>
          <Text style={styles.body}>Kuvat tallentuvat Supabase Storageen ja näkyvät tarjousdetailissä.</Text>
        </View>
      </Card>

      {message ? <Card style={styles.messageCard}><Text style={styles.messageText}>{message}</Text></Card> : null}

      <Button title={busy || syncLoading ? 'Tallennetaan...' : 'Valitse kuva puhelimesta'} icon="image-outline" onPress={addImage} disabled={busy || syncLoading} />

      {attachments.length ? (
        attachments.map((item) => (
          <Card key={item.id} style={styles.imageCard}>
            <Image source={{ uri: item.fileUrl }} style={styles.image} />
            <View style={styles.imageMeta}>
              <Text style={styles.fileName}>{item.fileName}</Text>
              <Text style={styles.small}>{item.mimeType ?? 'image'} · Supabase Storage</Text>
            </View>
          </Card>
        ))
      ) : (
        <Card>
          <Text style={styles.cardTitle}>Ei kuvia vielä</Text>
          <Text style={styles.body}>Lisää ensimmäinen kohdekuva, esimerkiksi asiakkaan lähettämä kuva työstä.</Text>
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: { width: 44, height: 44, justifyContent: 'center', marginLeft: -spacing.sm },
  title: { fontSize: typography.title, fontWeight: '900', color: colors.text, letterSpacing: -0.8 },
  subtitle: { marginTop: spacing.xs, fontSize: typography.body, color: colors.mutedText, fontWeight: '600' },
  summaryCard: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  iconBubble: { width: 48, height: 48, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.blueSoft },
  flex: { flex: 1 },
  cardTitle: { fontSize: typography.body, fontWeight: '900', color: colors.text, marginBottom: 2 },
  body: { fontSize: typography.body, lineHeight: 22, color: colors.mutedText, fontWeight: '600' },
  messageCard: { backgroundColor: colors.blueSoft },
  messageText: { color: colors.text, fontWeight: '800' },
  imageCard: { gap: spacing.sm, padding: spacing.md },
  image: { width: '100%', height: 210, borderRadius: radii.lg, backgroundColor: colors.background },
  imageMeta: { gap: 2 },
  fileName: { fontSize: typography.body, color: colors.text, fontWeight: '900' },
  small: { fontSize: typography.small, color: colors.mutedText, fontWeight: '600' },
});
