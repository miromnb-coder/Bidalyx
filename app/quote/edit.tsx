import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Screen } from '../../src/components/Screen';
import { TextField } from '../../src/components/TextField';
import { colors, spacing, typography } from '../../src/constants/theme';
import { useQuotes } from '../../src/state/QuoteContext';

export default function EditQuoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getQuoteById, updateQuote } = useQuotes();
  const quote = getQuoteById(id);

  const [jobTitle, setJobTitle] = useState(quote?.jobTitle ?? '');
  const [description, setDescription] = useState(quote?.description ?? '');
  const [price, setPrice] = useState(String(quote?.estimatedValue ?? ''));
  const [schedule, setSchedule] = useState(quote?.schedule ?? '');
  const [terms, setTerms] = useState(quote?.terms ?? '');

  if (!quote) {
    return (
      <Screen>
        <Pressable onPress={() => router.back()} style={styles.backButton}><Ionicons name="arrow-back" size={24} color={colors.text} /></Pressable>
        <Text style={styles.title}>Tarjousta ei löytynyt</Text>
      </Screen>
    );
  }

  function save() {
    updateQuote(quote.id, {
      jobTitle,
      description,
      estimatedValue: Number(price.replace(',', '.')) || quote.estimatedValue,
      schedule,
      terms,
    });
    router.replace(`/quote/${quote.id}`);
  }

  return (
    <Screen>
      <Pressable onPress={() => router.back()} style={styles.backButton}><Ionicons name="arrow-back" size={24} color={colors.text} /></Pressable>
      <View><Text style={styles.title}>Muokkaa tarjousta</Text><Text style={styles.subtitle}>Tarkista AI-luonnos ennen lähettämistä.</Text></View>
      <TextField label="Työn otsikko" value={jobTitle} onChangeText={setJobTitle} />
      <TextField label="Työn kuvaus" value={description} onChangeText={setDescription} multiline />
      <TextField label="Hinta" value={price} onChangeText={setPrice} keyboardType="numeric" />
      <TextField label="Aikataulu" value={schedule} onChangeText={setSchedule} />
      <TextField label="Ehdot" value={terms} onChangeText={setTerms} multiline />
      <Button title="Tallenna muutokset" icon="save-outline" onPress={save} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: { width: 44, height: 44, justifyContent: 'center', marginLeft: -spacing.sm },
  title: { fontSize: typography.h1, fontWeight: '900', color: colors.text },
  subtitle: { marginTop: spacing.xs, fontSize: typography.small, color: colors.mutedText, fontWeight: '600' },
});
