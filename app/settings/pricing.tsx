import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { TextField } from '../../src/components/TextField';
import { colors, spacing, typography } from '../../src/constants/theme';
import { useQuotes } from '../../src/state/QuoteContext';

function toNumber(value: string, fallback: number) {
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export default function PricingSettingsScreen() {
  const { pricing, updatePricing } = useQuotes();
  const [painting, setPainting] = useState(String(pricing.paintingPerSquareMeter));
  const [cleaning, setCleaning] = useState(String(pricing.cleaningPerSquareMeter));
  const [moving, setMoving] = useState(String(pricing.movingPerSquareMeter));
  const [startFee, setStartFee] = useState(String(pricing.startFee));
  const [travelFee, setTravelFee] = useState(String(pricing.travelFee));
  const [vat, setVat] = useState(String(pricing.vatPercent));

  function save() {
    updatePricing({ paintingPerSquareMeter: toNumber(painting, pricing.paintingPerSquareMeter), cleaningPerSquareMeter: toNumber(cleaning, pricing.cleaningPerSquareMeter), movingPerSquareMeter: toNumber(moving, pricing.movingPerSquareMeter), startFee: toNumber(startFee, pricing.startFee), travelFee: toNumber(travelFee, pricing.travelFee), vatPercent: toNumber(vat, pricing.vatPercent) });
    router.back();
  }

  return (
    <Screen>
      <Pressable onPress={() => router.back()} style={styles.backButton}><Ionicons name="arrow-back" size={24} color={colors.text} /></Pressable>
      <Text style={styles.title}>Hinnasto</Text>
      <Text style={styles.subtitle}>AI-luonnokset käyttävät näitä hintoja hinta-arvion pohjana.</Text>
      <Card style={styles.card}><TextField label="Maalaus €/m²" value={painting} onChangeText={setPainting} keyboardType="numeric" /><TextField label="Siivous €/m²" value={cleaning} onChangeText={setCleaning} keyboardType="numeric" /><TextField label="Muutto €/m²" value={moving} onChangeText={setMoving} keyboardType="numeric" /><TextField label="Aloitusmaksu €" value={startFee} onChangeText={setStartFee} keyboardType="numeric" /><TextField label="Matkakulu €" value={travelFee} onChangeText={setTravelFee} keyboardType="numeric" /><TextField label="ALV %" value={vat} onChangeText={setVat} keyboardType="numeric" /></Card>
      <Button title="Tallenna hinnasto" icon="save-outline" onPress={save} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: { width: 44, height: 44, justifyContent: 'center', marginLeft: -spacing.sm },
  title: { fontSize: typography.h1, fontWeight: '900', color: colors.text, letterSpacing: -0.6 },
  subtitle: { fontSize: typography.body, lineHeight: 22, color: colors.mutedText, fontWeight: '600' },
  card: { gap: spacing.md },
});
