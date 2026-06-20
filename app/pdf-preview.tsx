import { router } from 'expo-router';
import { Text } from 'react-native';
import { Button } from '../src/components/Button';
import { Screen } from '../src/components/Screen';

export default function PdfPreviewScreen() {
  return <Screen><Text>PDF-esikatselu</Text><Text>Tarjousdokumentin esikatselun pohja.</Text><Button title="Palaa" onPress={() => router.back()} /></Screen>;
}
