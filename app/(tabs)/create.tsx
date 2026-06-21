import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { TextField } from '../../src/components/TextField';
import { colors, radii, spacing, typography } from '../../src/constants/theme';

const serviceTypes = ['Maalaus', 'Siivous', 'Muutto', 'Remontti', 'Pihatyö'];
const hints: Record<string, string> = {
  Maalaus: 'Kysy neliöt, seinien kunto ja maalattavat pinnat.',
  Siivous: 'Kysy asunnon koko, siivoustyyppi ja aikataulu.',
  Muutto: 'Kysy lähtöpaikka, kohde, kerrokset ja tavaramäärä.',
  Remontti: 'Kysy työn tyyppi, materiaalit ja toivottu valmistumisaika.',
  Pihatyö: 'Kysy pihan koko, työn laajuus ja poisvietävät jätteet.',
};

export default function CreateQuoteScreen() {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('Tampere');
  const [area, setArea] = useState('48');
  const [serviceType, setServiceType] = useState(serviceTypes[0]);
  const [message, setMessage] = useState('');
  const [showError, setShowError] = useState(false);

  const canCreate = useMemo(() => customerName.trim().length > 1 && message.trim().length > 5, [customerName, message]);

  function handleCreateDraft() {
    if (!canCreate) {
      setShowError(true);
      return;
    }
    router.push({ pathname: '/quote/draft', params: { customerName, phone, email, location, area, serviceType, message } });
  }

  return (
    <Screen>
      <View style={styles.headerRow}><Pressable onPress={() => router.back()} style={styles.iconButton}><Ionicons name="arrow-back" size={24} color={colors.text} /></Pressable><View style={styles.stepBadge}><Text style={styles.stepText}>1 / 3</Text></View></View>
      <View><Text style={styles.title}>Luo uusi tarjous</Text><Text style={styles.subtitle}>Anna asiakkaan ja työn tiedot. Bidalyx muodostaa seuraavaksi laadukkaan tarjousluonnoksen.</Text></View>

      {showError ? <View style={styles.errorBox}><Ionicons name="alert-circle-outline" size={18} color={colors.orange} /><Text style={styles.errorText}>Lisää ainakin asiakkaan nimi ja lyhyt kuvaus työstä.</Text></View> : null}

      <Card style={styles.formCard}>
        <Text style={styles.sectionTitle}>Asiakas</Text>
        <TextField label="Asiakkaan nimi" placeholder="Esim. Matti Virtanen" value={customerName} onChangeText={setCustomerName} />
        <View style={styles.twoColumnRow}><View style={styles.flexItem}><TextField label="Puhelin" placeholder="040 123 4567" value={phone} onChangeText={setPhone} keyboardType="phone-pad" /></View><View style={styles.flexItem}><TextField label="Sähköposti" placeholder="asiakas@email.fi" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" /></View></View>
      </Card>

      <Card style={styles.formCard}>
        <Text style={styles.sectionTitle}>Työ</Text>
        <View style={styles.twoColumnRow}><View style={styles.flexItem}><TextField label="Sijainti" placeholder="Tampere" value={location} onChangeText={setLocation} /></View><View style={styles.flexItem}><TextField label="Koko" placeholder="48" value={area} onChangeText={setArea} keyboardType="numeric" /></View></View>
        <View style={styles.group}><Text style={styles.label}>Työn tyyppi</Text><View style={styles.chipRow}>{serviceTypes.map((type) => { const active = type === serviceType; return <Pressable key={type} onPress={() => setServiceType(type)} style={[styles.chip, active && styles.chipActive]}><Text style={[styles.chipText, active && styles.chipTextActive]}>{type}</Text></Pressable>; })}</View><View style={styles.hintBox}><Ionicons name="sparkles-outline" size={17} color={colors.blue} /><Text style={styles.hintText}>{hints[serviceType]}</Text></View></View>
      </Card>

      <Card style={styles.formCard}>
        <Text style={styles.sectionTitle}>Asiakkaan viesti</Text>
        <TextField label="Työn kuvaus" placeholder="Kuvaile työ tarkemmin ja asiakkaan toiveet..." value={message} onChangeText={setMessage} multiline />
        <View style={styles.group}><Text style={styles.label}>Lisää kuvia <Text style={styles.optional}>(valinnainen)</Text></Text><View style={styles.uploadBox}><Ionicons name="images-outline" size={30} color={colors.blue} /><Text style={styles.uploadTitle}>Lisää kuvia tai vedä tänne</Text><Text style={styles.uploadText}>Kohdekuvat voi lisätä myös tarjousdetailissä</Text></View></View>
      </Card>

      <Button title="Luo tarjous AI:lla" icon="sparkles-outline" onPress={handleCreateDraft} disabled={!canCreate} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginLeft: -spacing.sm },
  stepBadge: { paddingHorizontal: spacing.sm, paddingVertical: 7, borderRadius: radii.full, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  stepText: { fontSize: typography.tiny, fontWeight: '900', color: colors.mutedText },
  title: { fontSize: typography.h1, fontWeight: '900', color: colors.text, letterSpacing: -0.6 },
  subtitle: { marginTop: spacing.xs, fontSize: typography.body, lineHeight: 22, color: colors.mutedText, fontWeight: '600' },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderRadius: radii.lg, backgroundColor: colors.orangeSoft, borderWidth: 1, borderColor: '#FED7AA' },
  errorText: { flex: 1, fontSize: typography.small, fontWeight: '700', color: colors.text },
  formCard: { gap: spacing.md },
  sectionTitle: { fontSize: typography.h3, color: colors.text, fontWeight: '900' },
  twoColumnRow: { flexDirection: 'row', gap: spacing.sm },
  flexItem: { flex: 1 },
  group: { gap: spacing.xs },
  label: { fontSize: typography.small, fontWeight: '900', color: colors.text },
  optional: { color: colors.mutedText },
  chipRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  chip: { minHeight: 44, paddingHorizontal: spacing.md, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  chipActive: { backgroundColor: colors.black, borderColor: colors.black },
  chipText: { fontSize: typography.small, fontWeight: '900', color: colors.text },
  chipTextActive: { color: colors.card },
  hintBox: { marginTop: spacing.xs, flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, padding: spacing.md, borderRadius: radii.lg, backgroundColor: colors.blueSoft },
  hintText: { flex: 1, fontSize: typography.small, lineHeight: 19, color: colors.text, fontWeight: '700' },
  uploadBox: { minHeight: 138, borderRadius: radii.lg, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.border, backgroundColor: colors.backgroundElevated, alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  uploadTitle: { marginTop: spacing.xs, fontSize: typography.small, fontWeight: '900', color: colors.text },
  uploadText: { fontSize: typography.tiny, color: colors.mutedText, fontWeight: '700' },
});
