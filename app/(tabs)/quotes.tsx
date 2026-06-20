import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppHeader } from '../../src/components/AppHeader';
import { QuoteCard } from '../../src/components/QuoteCard';
import { Screen } from '../../src/components/Screen';
import { colors, radii, spacing, typography } from '../../src/constants/theme';
import { useQuotes } from '../../src/state/QuoteContext';
import { QuoteStatus } from '../../src/types/quote';

const filters: { label: string; value: 'all' | QuoteStatus }[] = [
  { label: 'Kaikki', value: 'all' },
  { label: 'Luonnos', value: 'draft' },
  { label: 'Lähetetty', value: 'sent' },
  { label: 'Odottaa', value: 'waiting' },
  { label: 'Hyväksytty', value: 'accepted' },
];

export default function QuotesScreen() {
  const { quotes } = useQuotes();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | QuoteStatus>('all');

  const filteredQuotes = useMemo(() => {
    return quotes.filter((quote) => {
      const matchesFilter = filter === 'all' || quote.status === filter;
      const text = `${quote.customerName} ${quote.jobTitle} ${quote.location}`.toLowerCase();
      const matchesQuery = text.includes(query.toLowerCase().trim());
      return matchesFilter && matchesQuery;
    });
  }, [quotes, filter, query]);

  return (
    <Screen>
      <AppHeader title="Tarjoukset" subtitle="Seuraa tarjouspyyntöjä ja avoimia kauppoja" />

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Hae asiakasta tai työtä..."
        placeholderTextColor={colors.subtleText}
        style={styles.searchBox}
      />

      <View style={styles.filters}>
        {filters.map((item) => {
          const active = filter === item.value;
          return (
            <Pressable key={item.value} onPress={() => setFilter(item.value)} style={[styles.filterChip, active && styles.filterChipActive]}>
              <Text style={[styles.filterText, active && styles.filterTextActive]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {filteredQuotes.length ? (
        filteredQuotes.map((quote) => <QuoteCard key={quote.id} quote={quote} onPress={() => router.push(`/quote/${quote.id}`)} />)
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Ei tarjouksia</Text>
          <Text style={styles.emptyText}>Kokeile toista hakua tai luo uusi tarjous.</Text>
        </View>
      )}
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
    paddingHorizontal: spacing.md,
    fontSize: typography.body,
    color: colors.text,
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    borderRadius: radii.xl,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    fontSize: typography.h3,
    color: colors.text,
    fontWeight: '900',
  },
  emptyText: {
    marginTop: spacing.xs,
    textAlign: 'center',
    color: colors.mutedText,
    fontWeight: '600',
  },
});
