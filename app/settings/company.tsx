import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Button } from '../../src/components/Button';
import { Screen } from '../../src/components/Screen';
import { TextField } from '../../src/components/TextField';
import { colors, spacing, typography } from '../../src/constants/theme';
import { useQuotes } from '../../src/state/QuoteContext';

export default function CompanySettingsScreen() {
  const { company, updateCompany } = useQuotes();
  const [name, setName] = useState(company.name);
  const [businessId, setBusinessId] = useState(company.businessId);
  const [email, setEmail] = useState(company.email);
  const [phone, setPhone] = useState(company.phone);
  const [website, setWebsite] = useState(company.website);
  const [location, setLocation] = useState(company.location);
  const [tagline, setTagline] = useState(company.tagline);

  function save() {
    updateCompany({ name, businessId, email, phone, website, location, tagline });
    router.back();
  }

  return (
    <Screen>
      <Pressable onPress={() => router.back()} style={styles.backButton}><Ionicons name="arrow-back" size={24} color={colors.text} /></Pressable>
      <Text style={styles.title}>Yrityksen tiedot</Text>
      <Text style={styles.subtitle}>Nämä tiedot näkyvät asiakkaan tarjousnäkymässä.</Text>
      <TextField label="Yrityksen nimi" value={name} onChangeText={setName} />
      <TextField label="Y-tunnus" value={businessId} onChangeText={setBusinessId} />
      <TextField label="Sähköposti" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextField label="Puhelin" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextField label="Verkkosivu" value={website} onChangeText={setWebsite} autoCapitalize="none" />
      <TextField label="Toimipaikka" value={location} onChangeText={setLocation} />
      <TextField label="Slogan" value={tagline} onChangeText={setTagline} />
      <Button title="Tallenna yritystiedot" icon="save-outline" onPress={save} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: { width: 44, height: 44, justifyContent: 'center', marginLeft: -spacing.sm },
  title: { fontSize: typography.h1, fontWeight: '900', color: colors.text },
  subtitle: { fontSize: typography.small, color: colors.mutedText, fontWeight: '600' },
});
