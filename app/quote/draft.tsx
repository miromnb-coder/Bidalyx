import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { colors, radii, spacing, typography } from '../../src/constants/theme';
import { buildQuoteDraft, formatDraftPrice } from '../../src/utils/buildQuoteDraft';

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default function DraftScreen() {
  const params = useLocalSearchParams();
  const draft = buildQuoteDraft({
    customerName: getParam(params.customerName),
    phone: getParam(params.phone),
    email: getParam(params.email),
    location: getParam(params.location),
    serviceType: getParam(params.serviceType),
    message: getParam(params.message),
    area: getParam(params.area),
  });

  function openCustomerPreview() {
    router.push({
      pathname: '/quote/customer-preview',
      params: {
        customerName: draft.customerName,
        location: draft.location,
        serviceType: draft.serviceType,
        jobTitle: draft.jobTitle,
        description: draft.description,
        price: String(draft.price),
        schedule: draft.schedule,
        includedItems: draft.includedItems.join('|'),
      },
    });
  }

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
        <Text style={styles.subtitle}>Tarkista luonnos, muokkaa tarvittaessa ja lähetä asiakkaalle.</Text>
      </View>

      <Card style={styles.summaryCard}>
        <View>
          <Text style={styles.summaryLabel}>Asiakas</Text>
          <Text style={styles.summaryTitle}>{draft.customerName}</Text>
          <Text style={styles.summarySub}>{draft.jobTitle}</Text>
        </View>
        <View style={styles.serviceBadge}>
          <Text style={styles.serviceText}>{draft.serviceType}</Text>
        </View>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Työn kuvaus</Text>
        <Text style={styles.body}>{draft.description}</Text>
      </Card>

      <Card style={styles.infoCard}>
        <View>
          <Text style={styles.cardTitle}>Hinta-arvio</Text>
          <Text style={styles.price}>{formatDraftPrice(draft.price)}</Text>
          <Text style={styles.smallText}>Arviohinta sis. alv 24%</Text>
        </View>
        <View style={styles.roundIcon}>
          <Ionicons name="pricetag-outline" size={22} color={colors.blue} />
        </View>
      </Card>

      <Card style={styles.infoCard}>
        <View>
          <Text style={styles.cardTitle}>Aikataulu</Text>
          <Text style={styles.body}>Arvioitu kesto: {draft.schedule}</Text>
          <Text style={styles.smallText}>Aloitus sopimuksen mukaan</Text>
        </View>
        <View style={styles.roundIcon}>
          <Ionicons name="calendar-outline" size={22} color={colors.blue} />
        </View>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Sisältää</Text>
        {draft.includedItems.map((item) => (
          <View key={item} style={styles.checkRow}>
            <Ionicons name="checkmark-circle-outline" size={18} color={colors.blue} />
            <Text style={styles.body}>{item}</Text>
          </View>
        ))}
      </Card>

      <Card style={styles.noteCard}>
        <Ionicons name="information-circle-outline" size={22} color={colors.blue} />
        <Text style={styles.noteText}>{draft.terms}</Text>
      </Card>

      <View style={styles.buttonRow}>
        <Button title="Muokkaa" variant="secondary" style={styles.flexButton} />
        <Button title="Lähetä" icon="paper-plane-outline" style={styles.flexButton} onPress={openCustomerPreview} />
      </View>
      <Button title="Luo uudelleen" variant="ghost" icon="refresh-outline" />
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
  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: colors.black,
  },
  summaryLabel: {
    fontSize: typography.tiny,
    color: colors.subtleText,
    fontWeight: '800',
  },
  summaryTitle: {
    marginTop: spacing.xs,
    fontSize: typography.h2,
    color: colors.card,
    fontWeight: '900',
  },
  summarySub: {
    marginTop: 2,
    fontSize: typography.small,
    color: colors.subtleText,
    fontWeight: '700',
  },
  serviceBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
    borderRadius: radii.full,
    backgroundColor: colors.card,
  },
  serviceText: {
    fontSize: typography.tiny,
    color: colors.text,
    fontWeight: '900',
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
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.blueSoft,
  },
  noteText: {
    flex: 1,
    fontSize: typography.small,
    lineHeight: 20,
    color: colors.text,
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  flexButton: {
    flex: 1,
  },
});
