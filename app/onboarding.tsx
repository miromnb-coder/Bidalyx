import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '../src/components/Button';
import { Card } from '../src/components/Card';
import { Screen } from '../src/components/Screen';
import { TextField } from '../src/components/TextField';
import { colors, radii, spacing, typography } from '../src/constants/theme';
import { useQuotes } from '../src/state/QuoteContext';

const industries = ['Maalaus', 'Siivous', 'Muutto'];

export default function OnboardingScreen() {
  const { company, updateCompany, updatePricing, completeOnboarding } = useQuotes();
  const [step, setStep] = useState(0);
  const [industry, setIndustry] = useState(industries[0]);
  const [companyName, setCompanyName] = useState(company.name);
  const [location, setLocation] = useState(company.location);
  const [basePrice, setBasePrice] = useState('26');

  function finish() {
    updateCompany({ name: companyName, location, tagline: 'Nopeat ja selkeät tarjoukset' });
    updatePricing({ paintingPerSquareMeter: Number(basePrice) || 26, cleaningPerSquareMeter: Number(basePrice) || 5.2, movingPerSquareMeter: Number(basePrice) || 8.4 });
    completeOnboarding();
    router.replace('/(tabs)/home');
  }

  return (
    <Screen>
      <View style={styles.logo}><Ionicons name="sparkles-outline" size={34} color={colors.card} /></View>
      <Text style={styles.title}>{step === 0 ? 'Tervetuloa Bidalyxiin' : step === 1 ? 'Valitse toimiala' : step === 2 ? 'Yrityksen tiedot' : 'Perushinnasto'}</Text>
      <Text style={styles.subtitle}>{step === 0 ? 'Rakenna tarjous muutamassa minuutissa ja seuraa avoimia kauppoja.' : 'Voit muuttaa näitä tietoja myöhemmin asetuksista.'}</Text>

      {step === 0 ? (
        <Card style={styles.hero}><Text style={styles.heroTitle}>AI-avusteinen tarjousprosessi</Text><Text style={styles.heroText}>Luo tarjous, lähetä linkki asiakkaalle ja seuraa hyväksyntää yhdessä sovelluksessa.</Text></Card>
      ) : null}

      {step === 1 ? (
        <View style={styles.chips}>{industries.map((item) => <Pressable key={item} onPress={() => setIndustry(item)} style={[styles.chip, industry === item && styles.chipActive]}><Text style={[styles.chipText, industry === item && styles.chipTextActive]}>{item}</Text></Pressable>)}</View>
      ) : null}

      {step === 2 ? (
        <>
          <TextField label="Yrityksen nimi" value={companyName} onChangeText={setCompanyName} />
          <TextField label="Toimipaikka" value={location} onChangeText={setLocation} />
        </>
      ) : null}

      {step === 3 ? (
        <TextField label={`${industry} perushinta`} value={basePrice} onChangeText={setBasePrice} keyboardType="numeric" />
      ) : null}

      <Button title={step < 3 ? 'Jatka' : 'Aloita käyttö'} icon="arrow-forward-outline" onPress={() => (step < 3 ? setStep(step + 1) : finish())} />
      <Button title="Ohita nyt" variant="ghost" onPress={finish} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  logo: { width: 70, height: 70, borderRadius: radii.xl, backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: typography.title, fontWeight: '900', color: colors.text, letterSpacing: -1 },
  subtitle: { fontSize: typography.body, lineHeight: 22, color: colors.mutedText, fontWeight: '600' },
  hero: { gap: spacing.sm, padding: spacing.lg },
  heroTitle: { fontSize: typography.h2, color: colors.text, fontWeight: '900' },
  heroText: { fontSize: typography.body, lineHeight: 22, color: colors.mutedText, fontWeight: '600' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radii.full, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.black, borderColor: colors.black },
  chipText: { fontWeight: '900', color: colors.mutedText },
  chipTextActive: { color: colors.card },
});
