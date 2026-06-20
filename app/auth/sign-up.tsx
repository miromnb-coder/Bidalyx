import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { TextField } from '../../src/components/TextField';
import { colors, radii, spacing, typography } from '../../src/constants/theme';
import { useAuth } from '../../src/state/AuthContext';

export default function SignUpScreen() {
  const { signUp, errorMessage } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    const ok = await signUp(email, password, fullName);
    setLoading(false);
    if (ok) router.replace('/');
  }

  return (
    <Screen>
      <View style={styles.logo}><Ionicons name="sparkles-outline" size={34} color={colors.card} /></View>
      <Text style={styles.title}>Luo tili</Text>
      <Text style={styles.subtitle}>Luo käyttäjätili ja lisää sen jälkeen ensimmäinen yritys.</Text>
      {errorMessage ? <Card style={styles.errorCard}><Text style={styles.errorText}>{errorMessage}</Text></Card> : null}
      <TextField label="Nimi" value={fullName} onChangeText={setFullName} placeholder="Oma nimi" />
      <TextField label="Sähköposti" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="sina@yritys.fi" />
      <TextField label="Salasana" value={password} onChangeText={setPassword} secureTextEntry placeholder="Vähintään 6 merkkiä" />
      <Button title={loading ? 'Luodaan...' : 'Luo tili'} icon="person-add-outline" onPress={submit} disabled={loading || !fullName || !email || password.length < 6} />
      <Pressable onPress={() => router.back()}><Text style={styles.link}>Minulla on jo tili</Text></Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  logo: { width: 70, height: 70, borderRadius: radii.xl, backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: typography.title, fontWeight: '900', color: colors.text, letterSpacing: -1 },
  subtitle: { fontSize: typography.body, lineHeight: 22, color: colors.mutedText, fontWeight: '600' },
  errorCard: { backgroundColor: colors.redSoft },
  errorText: { color: colors.red, fontWeight: '800' },
  link: { textAlign: 'center', color: colors.blue, fontWeight: '900', padding: spacing.md },
});
