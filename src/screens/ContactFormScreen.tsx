import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ContactsStackParamList } from '../navigation/types';
import { useData } from '../context/DataContext';
import CategoryPickerModal from '../components/CategoryPickerModal';

type Props = NativeStackScreenProps<ContactsStackParamList, 'ContactForm'>;

export default function ContactFormScreen({ navigation, route }: Props) {
  const { contacts, categories, addContact, updateContact } = useData();
  const contactId = route.params?.contactId;
  const existing = useMemo(() => contacts.find((c) => c.id === contactId), [contacts, contactId]);

  const [name, setName] = useState(existing?.name ?? '');
  const [phone, setPhone] = useState(existing?.phone ?? '');
  const [email, setEmail] = useState(existing?.email ?? '');
  const [notes, setNotes] = useState(existing?.notes ?? '');
  const [categoryId, setCategoryId] = useState<string | null>(existing?.categoryId ?? null);
  const [pickerVisible, setPickerVisible] = useState(false);

  const selectedCategory = categories.find((c) => c.id === categoryId);

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('Nom requis', 'Merci de renseigner un nom pour ce contact.');
      return;
    }
    const payload = {
      name: trimmed,
      phone: phone.trim(),
      email: email.trim(),
      notes: notes.trim(),
      categoryId,
    };
    if (existing) {
      await updateContact(existing.id, payload);
    } else {
      await addContact(payload);
    }
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text style={styles.label}>Nom</Text>
        <TextInput
          style={styles.input}
          placeholder="Jean Dupont"
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={setName}
          autoFocus={!existing}
        />

        <Text style={styles.label}>Téléphone</Text>
        <TextInput
          style={styles.input}
          placeholder="06 12 34 56 78"
          placeholderTextColor="#9CA3AF"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="jean.dupont@email.com"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Catégorie</Text>
        <Pressable style={styles.categorySelector} onPress={() => setPickerVisible(true)}>
          {selectedCategory ? (
            <View style={styles.selectedCategory}>
              <View style={[styles.dot, { backgroundColor: selectedCategory.color }]} />
              <Text style={styles.selectedCategoryText}>{selectedCategory.name}</Text>
            </View>
          ) : (
            <Text style={styles.placeholderText}>Sans catégorie</Text>
          )}
          <Text style={styles.chevron}>›</Text>
        </Pressable>

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Informations complémentaires..."
          placeholderTextColor="#9CA3AF"
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        <Pressable style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>{existing ? 'Enregistrer' : 'Créer la fiche'}</Text>
        </Pressable>
      </ScrollView>

      <CategoryPickerModal
        visible={pickerVisible}
        selectedCategoryId={categoryId}
        onClose={() => setPickerVisible(false)}
        onSelect={(id) => {
          setCategoryId(id);
          setPickerVisible(false);
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  multiline: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  categorySelector: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedCategory: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedCategoryText: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },
  placeholderText: {
    fontSize: 15,
    color: '#9CA3AF',
  },
  chevron: {
    fontSize: 20,
    color: '#D1D5DB',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  saveBtn: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 28,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
