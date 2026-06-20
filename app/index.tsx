import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { colors } from '../src/constants/theme';
import { useQuotes } from '../src/state/QuoteContext';

export default function Index() {
  const { loading, onboardingComplete } = useQuotes();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.text} />
      </View>
    );
  }

  return <Redirect href={onboardingComplete ? '/(tabs)/home' : '/onboarding'} />;
}
