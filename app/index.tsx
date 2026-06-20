import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { colors } from '../src/constants/theme';
import { useAuth } from '../src/state/AuthContext';
import { useQuotes } from '../src/state/QuoteContext';

export default function Index() {
  const auth = useAuth();
  const quotes = useQuotes();

  if (auth.loading || quotes.loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.text} />
      </View>
    );
  }

  if (!auth.session) {
    return <Redirect href="/auth/sign-in" />;
  }

  if (!auth.hasCompany) {
    return <Redirect href="/company-setup" />;
  }

  return <Redirect href={quotes.onboardingComplete ? '/(tabs)/home' : '/onboarding'} />;
}
