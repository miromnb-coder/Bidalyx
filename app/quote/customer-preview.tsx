import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { colors, radii, spacing, typography } from '../../src/constants/theme';

const includedItems = [
  'Pohjatyöt ja suojaukset',
  'Seinien ja kattojen maalaus',
  'Tarvikkeet ja materiaalit',
  'Loppusiivous',
];

export default function CustomerPreviewScreen() {
  return (
    <Screen>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </Pressable>

      <View>
        <Text style={styles.title}>Tarjous asiakkaalle</Text>
        <Text style={styles.subtitle}>Tarjous #Q-2024-0156</Text>
      </View>

      <Card style={styles.companyCard}>
        <View style={styles.logoMark}>
          <Ionicons name="home-outline" size={34} color={colors.text} />
        </View>
        <Text style={styles.companyName}>MaalausPartio Oy</Text>
        <Text style={styles.companySubtitle}>Luotettavaa laatua</Text>
      </Card>

      <View>
        <Text style={styles.jobTitle}>Kaksion maalaus, Tampere</Text>
        <Text style={styles.validText}>Tarjous voimassa 14 päivää</Text>
      </View>

      <Text style={styles.price}>1 250 €</Text>
      <Text style={styles.taxText}>sis. alv 24%</Text>

      <Card style={styles.infoCard}>
        <View>
          <Text style={styles.smallLabel}>Arvioitu kesto</Text>
          <Text style={styles.infoValue}>2–3 päivää</Text>
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
          <Text style={styles.body}>Teemme työn huolellisesti ja laadukkaasti.</Text>
        </View>
      </Card>

      <Button title="Hyväksy tarjous" icon="checkmark-circle-outline" />
      <Button title="Kysy lisätietoja" variant="secondary" icon="chatbubble-ellipses-outline" />
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
  companyCard: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xl,
  },
  logoMark: {
    width: 64,
    height: 64,
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
  jobTitle: {
    fontSize: typography.h3,
    fontWeight: '900',
    color: colors.text,
  },
  validText: {
    marginTop: 2,
    fontSize: typography.small,
    fontWeight: '700',
    color: colors.mutedText,
  },
  price: {
    fontSize: 38,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -1,
  },
  taxText: {
    marginTop: -spacing.md,
    fontSize: typography.small,
    fontWeight: '700',
    color: colors.mutedText,
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
});
