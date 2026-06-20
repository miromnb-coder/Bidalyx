import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../src/components/Button';
import { Card } from '../src/components/Card';
import { Screen } from '../src/components/Screen';
import { TextField } from '../src/components/TextField';
import { colors, radii, spacing, typography } from '../src/constants/theme';
import { useAuth } from '../src/state/AuthContext';

export default function CompanySetupScreen() {
  const { createFirstCompany, errorMessage, user, signOut } = useAuth();
  const [name, setName] = useState('');
  const [businessId, setBusinessId] = useState('');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('Tampere');
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    const ok = await createFirstCompany({ name, businessId, email, phone, website, location, tagline: 'Nopeat ja selkeät tarjoukset' });
    setLoading(false);
    if (ok) router.replace('/onboarding');
  }

  return (
    <Screen>
      <View style={styles.logo}><Ionicons name="business-outline" size={34} color={colors.card} /></View>
      <Text style={styles.title}>Lisää yritys</Text>
      <Text style={styles.subtitle}>Tämä luo ensimmäisen Bidalyx-työtilan Supabaseen ja lisää sinut omistajaksi.</Text>
      {errorMessage ? <Card style={styles.errorCard}><Text style={styles.errorText}>{errorMessage}</Text></Card> : null}
      <TextField label="Yrityksen nimi" value={name} onChangeText={setName} placeholder="Esim. MaalausPartio Oy" />
      <TextField label="Y-tunnus" value={businessId} onChangeText={setBusinessId} placeholder="1234567-8" />
      <TextField label="Sähköposti" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextField label="Puhelin" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextField label="Verkkosivu" value={website} onChangeText={setWebsite} autoCapitalize="none" placeholder="yritys.fi" />
      <TextField label="Toimipaikka" value={location} onChangeText={setLocation} />
      <Button title={loading ? 'Luodaan yritystä...' : 'Luo yritys'} icon="arrow-forward-outline" onPress={submit} disabled={loading || name.trim().length < 2} />
      <Button title="Kirjaudu ulos" variant="ghost" icon="log-out-outline" onPress={signOut} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  logo: { width: 70, height: 70, borderRadius: radii.xl, backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: typography.title, fontWeight: '900', color: colors.text, letterSpacing: -1 },
  subtitle: { fontSize: typography.body, lineHeight: 22, color: colors.mutedText, fontWeight: '600' },
  errorCard: { backgroundColor: colors.redSoft },
  errorText: { color: colors.red, fontWeight: '800' },
});
