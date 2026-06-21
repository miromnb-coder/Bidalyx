import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { TextField } from '../../src/components/TextField';
import { colors, radii, spacing, typography } from '../../src/constants/theme';
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
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </Pressable>
      <Text style={styles.title}>Yrityksen tiedot</Text>
      <Text style={styles.subtitle}>Nämä tiedot näkyvät tarjouksissa ja asiakkaan näkymässä.</Text>
      <Card style={styles.previewCard}>
        <View style={styles.logo}><Text style={styles.logoText}>{(name || 'B').slice(0, 1).toUpperCase()}</Text></View>
        <View style={styles.flex}>
          <Text style={styles.previewName}>{name || 'Yrityksen nimi'}</Text>
          <Text style={styles.previewMeta}>{tagline || 'Luotettavaa laatua'}</Text>
          <Text style={styles.previewMeta}>{email} · {phone}</Text>
        </View>
      </Card>
      <Card style={styles.formCard}>
        <TextField label="Yrityksen nimi" value={name} onChangeText={setName} />
        <TextField label="Y-tunnus" value={businessId} onChangeText={setBusinessId} />
        <TextField label="Sähköposti" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextField label="Puhelin" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <TextField label="Verkkosivu" value={website} onChangeText={setWebsite} autoCapitalize="none" />
        <TextField label="Toimipaikka" value={location} onChangeText={setLocation} />
        <TextField label="Slogan" value={tagline} onChangeText={setTagline} />
      </Card>
      <Button title="Tallenna yritystiedot" icon="save-outline" onPress={save} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: { width: 44, height: 44, justifyContent: 'center', marginLeft: -spacing.sm },
  title: { fontSize: typography.h1, fontWeight: '900', color: colors.text, letterSpacing: -0.6 },
  subtitle: { fontSize: typography.body, lineHeight: 22, color: colors.mutedText, fontWeight: '600' },
  previewCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.black, borderColor: colors.black, borderRadius: radii.xxl },
  logo: { width: 56, height: 56, borderRadius: radii.lg, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: typography.h2, color: colors.black, fontWeight: '900' },
  flex: { flex: 1 },
  previewName: { fontSize: typography.h3, color: colors.card, fontWeight: '900' },
  previewMeta: { marginTop: 2, fontSize: typography.small, color: colors.subtleText, fontWeight: '600' },
  formCard: { gap: spacing.md },
});
