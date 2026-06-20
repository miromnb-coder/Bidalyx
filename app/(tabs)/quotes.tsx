import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '../../src/components/AppHeader';
import { QuoteCard } from '../../src/components/QuoteCard';
import { Screen } from '../../src/components/Screen';
import { colors, radii, spacing, typography } from '../../src/constants/theme';
import { mockQuotes } from '../../src/data/mockQuotes';

const filters = ['Kaikki', 'Uudet', 'Odottaa', 'Hyväksytty'];

export default function QuotesScreen() {
  return (
    <Screen>
      <AppHeader title="Tarjoukset" subtitle="Seuraa tarjouspyyntöjä ja avoimia kauppoja" />

      <View style={styles.searchBox}>
        <Text style={styles.searchText}>Hae asiakasta tai työtä...</Text>
      </View>

      <View style={styles.filters}>
        {filters.map((filter, index) => (
          <View key={filter} style={[styles.filterChip, index === 0 && styles.filterChipActive]}>
            <Text style={[styles.filterText, index === 0 && styles.filterTextActive]}>{filter}</Text>
          </View>
        ))}
      </View>

      {mockQuotes.map((quote) => (
        <QuoteCard key={quote.id} quote={quote} onPress={() => router.push(`/quote/${quote.id}`)} />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    minHeight: 52,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  searchText: {
    color: colors.subtleText,
    fontSize: typography.body,
    fontWeight: '600',
  },
  filters: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  filterText: {
    fontSize: typography.small,
    fontWeight: '800',
    color: colors.mutedText,
  },
  filterTextActive: {
    color: colors.card,
  },
});
