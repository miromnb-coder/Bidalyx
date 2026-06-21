import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { TextField } from '../../src/components/TextField';
import { colors, radii, spacing, typography } from '../../src/constants/theme';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/state/AuthContext';
import { useQuotes } from '../../src/state/QuoteContext';
import { formatCurrency } from '../../src/utils/formatCurrency';

function serviceTypeFromLabel(label: string) {
  if (label === 'Maalaus') return 'painting';
  if (label === 'Siivous') return 'cleaning';
  if (label === 'Muutto') return 'moving';
  if (label === 'Pihatyö') return 'garden';
  if (label === 'Remontti') return 'renovation';
  return 'other';
}

export default function QuoteTemplatesScreen() {
  const { company } = useAuth();
  const { quoteTemplates, refreshRemote } = useQuotes();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [serviceLabel, setServiceLabel] = useState('Maalaus');
  const [price, setPrice] = useState('850');
  const [schedule, setSchedule] = useState('2–3 päivää');
  const [terms, setTerms] = useState('Lopullinen hinta vahvistetaan ennen työn aloitusta.');
  const [items, setItems] = useState('Pohjatyöt, Materiaalit, Työ, Loppusiivous');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  function clearForm() {
    setEditingId(null);
    setName('');
    setServiceLabel('Maalaus');
    setPrice('850');
    setSchedule('2–3 päivää');
    setTerms('Lopullinen hinta vahvistetaan ennen työn aloitusta.');
    setItems('Pohjatyöt, Materiaalit, Työ, Loppusiivous');
    setDescription('');
  }

  function startEdit(template: typeof quoteTemplates[number]) {
    setEditingId(template.id);
    setName(template.name);
    setServiceLabel(template.serviceType === 'cleaning' ? 'Siivous' : template.serviceType === 'moving' ? 'Muutto' : template.serviceType === 'garden' ? 'Pihatyö' : template.serviceType === 'renovation' ? 'Remontti' : 'Maalaus');
    setPrice(String(template.basePrice));
    setSchedule(template.defaultSchedule);
    setTerms(template.defaultTerms);
    setItems(template.includedItems.join(', '));
    setDescription(template.descriptionTemplate);
    setMessage('');
  }

  async function saveTemplate() {
    if (!company?.id || !name.trim()) {
      setMessage('Lisää pohjan nimi ja varmista, että yritys on luotu.');
      return;
    }
    setSaving(true);
    setMessage('');
    const payload = {
      company_id: company.id,
      name: name.trim(),
      service_type: serviceTypeFromLabel(serviceLabel),
      description_template: description.trim(),
      default_schedule: schedule.trim(),
      default_terms: terms.trim(),
      included_items: items.split(',').map((item) => item.trim()).filter(Boolean),
      base_price: Number(price.replace(',', '.')) || 0,
    };
    const result = editingId
      ? await supabase.from('quote_templates').update(payload).eq('id', editingId)
      : await supabase.from('quote_templates').insert(payload);
    setSaving(false);
    if (result.error) {
      setMessage(result.error.message);
      return;
    }
    await refreshRemote();
    clearForm();
    setMessage(editingId ? 'Pohja päivitetty.' : 'Uusi pohja luotu.');
  }

  return (
    <Screen>
      <Pressable onPress={() => router.back()} style={styles.backButton}><Ionicons name="arrow-back" size={24} color={colors.text} /></Pressable>
      <Text style={styles.title}>Tarjouspohjat</Text>
      <Text style={styles.subtitle}>Luo ja muokkaa Supabaseen tallennettavia tarjouspohjia.</Text>

      <Card style={styles.editorCard}>
        <Text style={styles.cardTitle}>{editingId ? 'Muokkaa pohjaa' : 'Uusi tarjouspohja'}</Text>
        <TextField label="Pohjan nimi" value={name} onChangeText={setName} placeholder="Kaksion maalaus" />
        <View style={styles.row}><View style={styles.flex}><TextField label="Palvelu" value={serviceLabel} onChangeText={setServiceLabel} /></View><View style={styles.flex}><TextField label="Oletushinta" value={price} onChangeText={setPrice} keyboardType="numeric" /></View></View>
        <TextField label="Oletusaikataulu" value={schedule} onChangeText={setSchedule} />
        <TextField label="Kuvauspohja" value={description} onChangeText={setDescription} multiline placeholder="Mitä työ sisältää?" />
        <TextField label="Sisältölista pilkuilla" value={items} onChangeText={setItems} multiline />
        <TextField label="Oletusehdot" value={terms} onChangeText={setTerms} multiline />
        <View style={styles.row}><Button title={saving ? 'Tallennetaan...' : editingId ? 'Tallenna muutokset' : 'Luo pohja'} icon="save-outline" style={styles.flex} onPress={saveTemplate} disabled={saving} /><Button title="Tyhjennä" variant="secondary" style={styles.flex} onPress={clearForm} /></View>
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </Card>

      {quoteTemplates.length ? quoteTemplates.map((template) => (
        <Card key={template.id} style={styles.card}>
          <View style={styles.topRow}><View style={styles.icon}><Ionicons name="document-text-outline" size={22} color={colors.blue} /></View><View style={styles.flex}><Text style={styles.name}>{template.name}</Text><Text style={styles.meta}>{template.defaultSchedule} · {formatCurrency(template.basePrice)}</Text></View></View>
          <Text style={styles.body}>{template.descriptionTemplate}</Text>
          {template.includedItems.map((item) => <Text key={item} style={styles.item}>• {item}</Text>)}
          <View style={styles.row}><Button title="Käytä" variant="secondary" icon="copy-outline" style={styles.flex} onPress={() => router.push('/(tabs)/create')} /><Button title="Muokkaa" variant="ghost" icon="create-outline" style={styles.flex} onPress={() => startEdit(template)} /></View>
        </Card>
      )) : <Card><Text style={styles.body}>Pohjia ei vielä löytynyt. Luo ensimmäinen pohja yllä olevalla lomakkeella.</Text></Card>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: { width: 44, height: 44, justifyContent: 'center', marginLeft: -spacing.sm },
  title: { fontSize: typography.title, color: colors.text, fontWeight: '900' },
  subtitle: { fontSize: typography.body, color: colors.mutedText, fontWeight: '600', lineHeight: 22 },
  editorCard: { gap: spacing.sm, backgroundColor: colors.blueSoft },
  card: { gap: spacing.sm },
  cardTitle: { fontSize: typography.h3, color: colors.text, fontWeight: '900' },
  topRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  icon: { width: 44, height: 44, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.blueSoft },
  flex: { flex: 1 },
  row: { flexDirection: 'row', gap: spacing.sm },
  name: { fontSize: typography.h3, color: colors.text, fontWeight: '900' },
  meta: { fontSize: typography.small, color: colors.mutedText, fontWeight: '700' },
  body: { fontSize: typography.body, lineHeight: 22, color: colors.mutedText, fontWeight: '600' },
  item: { fontSize: typography.small, color: colors.text, fontWeight: '700' },
  message: { fontSize: typography.small, color: colors.blue, fontWeight: '900' },
});
