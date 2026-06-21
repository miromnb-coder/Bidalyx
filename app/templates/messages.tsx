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

const defaultTypes = ['quote_sent', 'reminder', 'expiring', 'accepted', 'question'];
const linkPlaceholder = '{{link}}';

export default function MessageTemplatesScreen() {
  const { company } = useAuth();
  const { messageTemplates, refreshRemote } = useQuotes();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [type, setType] = useState('quote_sent');
  const [subject, setSubject] = useState('Tarjouksesi');
  const [body, setBody] = useState('Hei! Tässä tarjouksesi: {{link}}');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  function clearForm() {
    setEditingId(null);
    setType('quote_sent');
    setSubject('Tarjouksesi');
    setBody('Hei! Tässä tarjouksesi: {{link}}');
  }

  function startEdit(template: typeof messageTemplates[number]) {
    setEditingId(template.id);
    setType(template.type);
    setSubject(template.subject ?? '');
    setBody(template.body);
    setMessage('');
  }

  async function saveTemplate() {
    if (!company?.id || !type.trim() || !body.trim()) {
      setMessage('Lisää tyyppi ja viestin sisältö.');
      return;
    }
    setSaving(true);
    setMessage('');
    const payload = { company_id: company.id, type: type.trim(), subject: subject.trim() || null, body: body.trim() };
    const result = editingId
      ? await supabase.from('message_templates').update(payload).eq('id', editingId)
      : await supabase.from('message_templates').upsert(payload, { onConflict: 'company_id,type' });
    setSaving(false);
    if (result.error) {
      setMessage(result.error.message);
      return;
    }
    await refreshRemote();
    clearForm();
    setMessage(editingId ? 'Viestipohja päivitetty.' : 'Viestipohja tallennettu.');
  }

  return (
    <Screen>
      <Pressable onPress={() => router.back()} style={styles.backButton}><Ionicons name="arrow-back" size={24} color={colors.text} /></Pressable>
      <Text style={styles.title}>Viestipohjat</Text>
      <Text style={styles.subtitle}>Muokkaa lähetys-, muistutus- ja hyväksyntäviestejä. Käytä muuttujaa {linkPlaceholder} tarjouslinkin kohdalla.</Text>

      <Card style={styles.editorCard}>
        <Text style={styles.cardTitle}>{editingId ? 'Muokkaa viestipohjaa' : 'Uusi viestipohja'}</Text>
        <TextField label="Tyyppi" value={type} onChangeText={setType} placeholder="quote_sent" />
        <View style={styles.typeRow}>{defaultTypes.map((item) => <Pressable key={item} onPress={() => setType(item)} style={[styles.typeChip, type === item && styles.typeChipActive]}><Text style={[styles.typeText, type === item && styles.typeTextActive]}>{item}</Text></Pressable>)}</View>
        <TextField label="Otsikko" value={subject} onChangeText={setSubject} placeholder="Tarjouksesi" />
        <TextField label="Viestin sisältö" value={body} onChangeText={setBody} multiline />
        <View style={styles.row}><Button title={saving ? 'Tallennetaan...' : editingId ? 'Tallenna muutokset' : 'Tallenna pohja'} icon="save-outline" style={styles.flex} onPress={saveTemplate} disabled={saving} /><Button title="Tyhjennä" variant="secondary" style={styles.flex} onPress={clearForm} /></View>
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </Card>

      {messageTemplates.length ? messageTemplates.map((template) => (
        <Card key={template.id} style={styles.card}>
          <View style={styles.topRow}><View style={styles.icon}><Ionicons name="chatbubble-ellipses-outline" size={22} color={colors.blue} /></View><View style={styles.flex}><Text style={styles.name}>{template.subject ?? template.type}</Text><Text style={styles.meta}>{template.type}</Text></View></View>
          <Text style={styles.body}>{template.body}</Text>
          <Button title="Muokkaa" variant="secondary" icon="create-outline" onPress={() => startEdit(template)} />
        </Card>
      )) : <Card><Text style={styles.body}>Viestipohjia ei vielä löytynyt. Luo ensimmäinen pohja yllä olevalla lomakkeella.</Text></Card>}
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
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  typeChip: { paddingHorizontal: spacing.sm, paddingVertical: 8, borderRadius: radii.full, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  typeChipActive: { backgroundColor: colors.black, borderColor: colors.black },
  typeText: { fontSize: typography.tiny, color: colors.text, fontWeight: '900' },
  typeTextActive: { color: colors.card },
  name: { fontSize: typography.h3, color: colors.text, fontWeight: '900' },
  meta: { fontSize: typography.small, color: colors.mutedText, fontWeight: '700' },
  body: { fontSize: typography.body, lineHeight: 22, color: colors.mutedText, fontWeight: '600' },
  message: { fontSize: typography.small, color: colors.blue, fontWeight: '900' },
});
