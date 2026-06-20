import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Screen } from '../../src/components/Screen';
import { TextField } from '../../src/components/TextField';
import { colors, radii, spacing, typography } from '../../src/constants/theme';

const serviceTypes = ['Maalaus', 'Siivous', 'Muutto'];

export default function CreateQuoteScreen() {
  return (
    <Screen>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
      </View>

      <View>
        <Text style={styles.title}>Luo uusi tarjous</Text>
        <Text style={styles.subtitle}>Kerro työstä, niin AI laatii tarjousluonnoksen puolestasi.</Text>
      </View>

      <TextField label="Asiakkaan nimi" placeholder="Esim. Matti Virtanen" />

      <View style={styles.group}>
        <Text style={styles.label}>Työn tyyppi</Text>
        <View style={styles.chipRow}>
          {serviceTypes.map((type, index) => (
            <View key={type} style={[styles.chip, index === 0 && styles.chipActive]}>
              <Text style={[styles.chipText, index === 0 && styles.chipTextActive]}>{type}</Text>
            </View>
          ))}
        </View>
      </View>

      <TextField label="Asiakkaan viesti" placeholder="Kuvaile työn tarkemmin ja asiakkaan toiveet..." multiline />

      <View style={styles.group}>
        <Text style={styles.label}>Lisää kuvia <Text style={styles.optional}>(valinnainen)</Text></Text>
        <View style={styles.uploadBox}>
          <Ionicons name="images-outline" size={30} color={colors.blue} />
          <Text style={styles.uploadTitle}>Lisää kuvia tai vedä tänne</Text>
          <Text style={styles.uploadText}>JPG, PNG, HEIC – max 10 MB</Text>
        </View>
      </View>

      <Button title="Luo tarjous AI:lla" icon="sparkles-outline" onPress={() => router.push('/quote/draft')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -spacing.sm,
  },
  title: {
    fontSize: typography.h1,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.6,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: typography.small,
    color: colors.mutedText,
    fontWeight: '600',
  },
  group: {
    gap: spacing.xs,
  },
  label: {
    fontSize: typography.small,
    fontWeight: '800',
    color: colors.text,
  },
  optional: {
    color: colors.mutedText,
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    minHeight: 46,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  chipText: {
    fontSize: typography.small,
    fontWeight: '800',
    color: colors.text,
  },
  chipTextActive: {
    color: colors.card,
  },
  uploadBox: {
    minHeight: 150,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  uploadTitle: {
    marginTop: spacing.xs,
    fontSize: typography.small,
    fontWeight: '800',
    color: colors.text,
  },
  uploadText: {
    fontSize: typography.tiny,
    color: colors.mutedText,
    fontWeight: '600',
  },
});
