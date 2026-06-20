import { router } from 'expo-router';
import { Text } from 'react-native';

import { Button } from '../src/components/Button';
import { Screen } from '../src/components/Screen';

export default function DocView() {
  return <Screen><Text>Document preview</Text><Button title="Back" onPress={() => router.back()} /></Screen>;
}
