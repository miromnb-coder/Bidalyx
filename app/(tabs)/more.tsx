import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '../../src/components/AppHeader';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { colors, spacing, typography } from '../../src/constants/theme';

const items: { title: string; subtitle: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { title: 'Yrityksen tiedot', subtitle: 'Logo, Y-tunnus ja yhteystiedot', icon: 'business-outline' },
  { title: 'Hinnasto', subtitle: 'Tunti-, neliö- ja lisäpalveluhinnat', icon: 'pricetag-outline' },
  { title: 'Tarjouspohjat', subtitle: 'Valmiit pohjat eri palveluille', icon: 'document-text-outline' },
  { title: 'Viestipohjat', subtitle: 'Muistutukset ja lähetysviestit', icon: 'chatbubble-ellipses-outline' },
  { title: 'App info', subtitle: 'Bidalyx 0.1.0', icon: 'information-circle-outline' },
];

export default function MoreScreen() {
  return (
    <Screen>
      <AppHeader title="Lisää" subtitle="Asetukset ja hallinta" />

      {items.map((item) => (
        <Card key={item.title} style={styles.item}>
          <View style={styles.iconWrap}>
            <Ionicons name={item.icon} size={22} color={colors.blue} />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.subtleText} />
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blueSoft,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: typography.body,
    fontWeight: '900',
    color: colors.text,
  },
  subtitle: {
    marginTop: 2,
    fontSize: typography.small,
    color: colors.mutedText,
    fontWeight: '600',
  },
});
