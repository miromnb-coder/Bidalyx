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
          <Stack screenOptions={{ headerShown: false }} />
        </QuoteProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
