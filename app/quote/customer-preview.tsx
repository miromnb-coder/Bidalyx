import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { colors, radii, spacing, typography } from '../../src/constants/theme';
import { formatDraftPrice } from '../../src/utils/buildQuoteDraft';

function getParam(value: string | string[] | undefined, fallback: string) {
  return Array.isArray(value) ? value[0] ?? fallback : value ?? fallback;
}

export default function CustomerPreviewScreen() {
  const params = useLocalSearchParams();
  const jobTitle = getParam(params.jobTitle, 'Kaksion maalaus, Tampere');
  const customerName = getParam(params.customerName, 'Matti Virtanen');
  const schedule = getParam(params.schedule, '2–3 päivää');
  const description = getParam(params.description, 'Sisätilojen maalaus asiakkaan toiveiden mukaan.');
  const price = Number(getParam(params.price, '1250')) || 1250;
  const includedItems = getParam(params.includedItems, 'Pohjatyöt ja suojaukset|Seinien ja kattojen maalaus|Tarvikkeet ja materiaalit|Loppusiivous').split('|');

  return (
    <Screen>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </Pressable>

      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Tarjous asiakkaalle</Text>
          <Text style={styles.subtitle}>Tarjous #BID-2024-0156</Text>
        </View>
        <View style={styles.secureBadge}>
          <Ionicons name="lock-closed-outline" size={14} color={colors.green} />
          <Text style={styles.secureText}>Turvallinen</Text>
        </View>
      </View>

      <Card style={styles.companyCard}>
        <View style={styles.logoMark}>
          <Ionicons name="sparkles-outline" size={34} color={colors.text} />
        </View>
        <Text style={styles.companyName}>Bidalyx Demo Oy</Text>
        <Text style={styles.companySubtitle}>Nopeat ja selkeät tarjoukset</Text>
      </Card>

      <Card style={styles.offerCard}>
        <Text style={styles.validText}>Tarjous voimassa 14 päivää</Text>
        <Text style={styles.jobTitle}>{jobTitle}</Text>
        <Text style={styles.customerText}>Asiakas: {customerName}</Text>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.priceRow}>
          <View>
            <Text style={styles.price}>{formatDraftPrice(price)}</Text>
            <Text style={styles.taxText}>sis. alv 24%</Text>
          </View>
          <View style={styles.priceBadge}>
            <Ionicons name="pricetag-outline" size={22} color={colors.blue} />
          </View>
        </View>
      </Card>

      <Card style={styles.infoCard}>
        <View>
          <Text style={styles.smallLabel}>Arvioitu kesto</Text>
          <Text style={styles.infoValue}>{schedule}</Text>
        </View>
        <Ionicons name="calendar-outline" size={24} color={colors.blue} />
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Tähän sisältyy</Text>
        {includedItems.map((item) => (
          <View key={item} style={styles.checkRow}>
            <Ionicons name="checkmark-circle-outline" size={18} color={colors.blue} />
            <Text style={styles.body}>{item}</Text>
          </View>
        ))}
      </Card>

      <Card style={styles.guaranteeCard}>
        <Ionicons name="shield-checkmark-outline" size={28} color={colors.blue} />
        <View style={styles.guaranteeText}>
          <Text style={styles.cardTitle}>Tyytyväisyystakuu</Text>
          <Text style={styles.body}>Teemme työn huolellisesti ja varmistamme lopputuloksen ennen laskutusta.</Text>
        </View>
      </Card>

      <View style={styles.actionArea}>
        <Button title="Hyväksy tarjous" icon="checkmark-circle-outline" />
        <Button title="Kysy lisätietoja" variant="secondary" icon="chatbubble-ellipses-outline" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    marginLeft: -spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  title: {
    fontSize: typography.h1,
    fontWeight: '900',
    color: colors.text,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: typography.small,
    color: colors.mutedText,
    fontWeight: '700',
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
    borderRadius: radii.full,
    backgroundColor: colors.greenSoft,
  },
  secureText: {
    fontSize: typography.tiny,
    fontWeight: '900',
    color: colors.green,
  },
  companyCard: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xl,
  },
  logoMark: {
    width: 66,
    height: 66,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  companyName: {
    marginTop: spacing.sm,
    fontSize: typography.h3,
    fontWeight: '900',
    color: colors.text,
  },
  companySubtitle: {
    fontSize: typography.small,
    fontWeight: '700',
    color: colors.mutedText,
  },
  offerCard: {
    gap: spacing.sm,
  },
  validText: {
    fontSize: typography.tiny,
    fontWeight: '900',
    color: colors.blue,
  },
  jobTitle: {
    fontSize: typography.h2,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.4,
  },
  customerText: {
    fontSize: typography.small,
    fontWeight: '800',
    color: colors.mutedText,
  },
  description: {
    fontSize: typography.small,
    lineHeight: 20,
    fontWeight: '600',
    color: colors.mutedText,
  },
  priceRow: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 40,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -1,
  },
  taxText: {
    fontSize: typography.small,
    fontWeight: '700',
    color: colors.mutedText,
  },
  priceBadge: {
    width: 52,
    height: 52,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blueSoft,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  smallLabel: {
    fontSize: typography.small,
    fontWeight: '800',
    color: colors.mutedText,
  },
  infoValue: {
    marginTop: 2,
    fontSize: typography.h3,
    fontWeight: '900',
    color: colors.text,
  },
  cardTitle: {
    fontSize: typography.body,
    fontWeight: '900',
    color: colors.text,
  },
  body: {
    fontSize: typography.small,
    lineHeight: 20,
    fontWeight: '600',
    color: colors.mutedText,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  guaranteeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.blueSoft,
  },
  guaranteeText: {
    flex: 1,
    gap: 2,
  },
  actionArea: {
    gap: spacing.sm,
  },
});
