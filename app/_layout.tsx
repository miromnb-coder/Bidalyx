import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AuthProvider } from '../src/state/AuthContext';
import { QuoteProvider } from '../src/state/QuoteContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <QuoteProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="auth/sign-in" />
            <Stack.Screen name="auth/sign-up" />
            <Stack.Screen name="company-setup" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="quote/[id]" />
            <Stack.Screen name="quote/draft" />
            <Stack.Screen name="quote/edit" />
            <Stack.Screen name="quote/customer-preview" />
            <Stack.Screen name="quote/accept" />
            <Stack.Screen name="quote/accepted" />
            <Stack.Screen name="quote/share" />
            <Stack.Screen name="customer/[id]" />
            <Stack.Screen name="settings/company" />
            <Stack.Screen name="settings/pricing" />
          </Stack>
        </QuoteProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
