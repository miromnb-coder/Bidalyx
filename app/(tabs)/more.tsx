import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '../../src/components/AppHeader';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { colors, radii, spacing, typography } from '../../src/constants/theme';
import { useAuth } from '../../src/state/AuthContext';

const items: { title: string; subtitle: string; icon: keyof typeof Ionicons.glyphMap; route?: string }[] = [
  { title: 'Ilmoitukset', subtitle: 'Muistutukset ja hyväksynnät', icon: 'notifications-outline', route: '/notifications' },
  { title: 'Analytiikka', subtitle: 'Myynti, voittoprosentti ja avoimet tarjoukset', icon: 'analytics-outline', route: '/analytics' },
  { title: 'Tarjouspohjat', subtitle: 'Pohjat, hinnat ja sisältölistat', icon: 'document-text-outline', route: '/templates/quotes' },
  { title: 'Viestipohjat', subtitle: 'Lähetys ja muistutukset', icon: 'chatbubble-ellipses-outline', route: '/templates/messages' },
  { title: 'Yrityksen tiedot', subtitle: 'Logo, Y-tunnus ja yhteystiedot', icon: 'business-outline', route: '/settings/company' },
  { title: 'Hinnasto', subtitle: 'Neliöhinnat, aloitusmaksu ja matkakulu', icon: 'pricetag-outline', route: '/settings/pricing' },
  { title: 'SaaS-paketit', subtitle: 'Starter, Pro ja Business', icon: 'card-outline', route: '/subscriptions' },
  { title: 'Onboarding', subtitle: 'Avaa käyttöönotto uudelleen', icon: 'rocket-outline', route: '/onboarding' },
];

export default function MoreScreen() {
  const { user, company, signOut } = useAuth();
  async function logOut() { await signOut(); router.replace('/auth/sign-in'); }
  return (
    <Screen>
      <AppHeader title="Lisää" subtitle="Asetukset ja hallinta" />
      <Card style={styles.accountCard}><Text style={styles.accountTitle}>{company?.name ?? 'Bidalyx-työtila'}</Text><Text style={styles.accountSubtitle}>{user?.email ?? 'Ei käyttäjää'}</Text><View style={styles.connectedPill}><View style={styles.connectedDot} /><Text style={styles.connected}>Supabase yhdistetty</Text></View></Card>
      {items.map((item) => <Pressable key={item.title} onPress={() => item.route && router.push(item.route)}><Card style={styles.item}><View style={styles.iconWrap}><Ionicons name={item.icon} size={22} color={colors.blue} /></View><View style={styles.textWrap}><Text style={styles.title}>{item.title}</Text><Text style={styles.subtitle}>{item.subtitle}</Text></View><Ionicons name="chevron-forward" size={20} color={colors.subtleText} /></Card></Pressable>)}
      <Button title="Kirjaudu ulos" variant="secondary" icon="log-out-outline" onPress={logOut} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  accountCard: { gap: spacing.xs, backgroundColor: colors.black, borderColor: colors.black, borderRadius: radii.xxl },
  accountTitle: { fontSize: typography.h3, fontWeight: '900', color: colors.card },
  accountSubtitle: { fontSize: typography.small, color: colors.subtleText, fontWeight: '600' },
  connectedPill: { alignSelf: 'flex-start', marginTop: spacing.xs, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: radii.full, backgroundColor: 'rgba(255,255,255,0.08)' },
  connectedDot: { width: 7, height: 7, borderRadius: radii.full, backgroundColor: colors.green },
  connected: { fontSize: typography.tiny, color: colors.green, fontWeight: '900' },
  item: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: 76 },
  iconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.blueSoft },
  textWrap: { flex: 1 },
  title: { fontSize: typography.body, fontWeight: '900', color: colors.text },
  subtitle: { marginTop: 2, fontSize: typography.small, color: colors.mutedText, fontWeight: '600' },
});
