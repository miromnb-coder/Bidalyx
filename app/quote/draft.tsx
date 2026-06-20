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

export default function DraftScreen() {
  return (
    <Screen>
      <View style={styles.topRow}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.aiBadge}>
          <Ionicons name="sparkles-outline" size={14} color={colors.blue} />
          <Text style={styles.aiText}>AI-luonnos</Text>
        </View>
      </View>

      <View>
        <Text style={styles.title}>Tarjousluonnos valmis</Text>
        <Text style={styles.subtitle}>Tässä AI:n laatima luonnos. Muokkaa ja lähetä.</Text>
      </View>

      <Card>
        <Text style={styles.cardTitle}>Työn kuvaus</Text>
        <Text style={styles.body}>Kaksion sisätilojen maalaus. Seinien ja kattojen maalaus valkoisilla sävyillä. Sisältää pohjatyöt ja suojaukset.</Text>
      </Card>

      <Card style={styles.infoCard}>
        <View>
          <Text style={styles.cardTitle}>Hinta-arvio</Text>
          <Text style={styles.price}>1 250 €</Text>
          <Text style={styles.smallText}>Arviohinta sis. alv 24%</Text>
        </View>
        <View style={styles.roundIcon}>
          <Ionicons name="pricetag-outline" size={22} color={colors.blue} />
        </View>
      </Card>

      <Card style={styles.infoCard}>
        <View>
          <Text style={styles.cardTitle}>Aikataulu</Text>
          <Text style={styles.body}>Arvioitu kesto: 2–3 päivää</Text>
          <Text style={styles.smallText}>Aloitus sopimuksen mukaan</Text>
        </View>
        <View style={styles.roundIcon}>
          <Ionicons name="calendar-outline" size={22} color={colors.blue} />
        </View>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Sisältää</Text>
        {includedItems.map((item) => (
          <View key={item} style={styles.checkRow}>
            <Ionicons name="checkmark-circle-outline" size={18} color={colors.blue} />
            <Text style={styles.body}>{item}</Text>
          </View>
        ))}
      </Card>

      <View style={styles.buttonRow}>
        <Button title="Muokkaa" variant="secondary" style={styles.flexButton} />
        <Button title="Lähetä" icon="paper-plane-outline" style={styles.flexButton} onPress={() => router.push('/quote/customer-preview')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    marginLeft: -spacing.sm,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radii.full,
    backgroundColor: colors.blueSoft,
  },
  aiText: {
    fontSize: typography.tiny,
    fontWeight: '900',
    color: colors.blue,
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
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: typography.body,
    color: colors.text,
    fontWeight: '900',
    marginBottom: spacing.xs,
  },
  body: {
    fontSize: typography.body,
    lineHeight: 22,
    color: colors.mutedText,
    fontWeight: '600',
  },
  infoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: typography.h1,
    fontWeight: '900',
    color: colors.text,
  },
  smallText: {
    fontSize: typography.small,
    color: colors.mutedText,
    fontWeight: '600',
  },
  roundIcon: {
    width: 48,
    height: 48,
    borderRadius: radii.full,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  flexButton: {
    flex: 1,
  },
});
