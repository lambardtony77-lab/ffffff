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
import { CategoriesStackParamList } from '../navigation/types';
import { useData } from '../context/DataContext';
import { CATEGORY_COLORS, randomCategoryColor } from '../utils/colors';

type Props = NativeStackScreenProps<CategoriesStackParamList, 'CategoryForm'>;

export default function CategoryFormScreen({ navigation, route }: Props) {
  const { categories, addCategory, updateCategory, deleteCategory, contactsForCategory } = useData();
  const categoryId = route.params?.categoryId;
  const existing = useMemo(() => categories.find((c) => c.id === categoryId), [categories, categoryId]);

  const [name, setName] = useState(existing?.name ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [color, setColor] = useState(existing?.color ?? randomCategoryColor());

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('Nom requis', 'Merci de nommer cette catégorie.');
      return;
    }
    if (existing) {
      await updateCategory(existing.id, { name: trimmed, description: description.trim(), color });
    } else {
      await addCategory({ name: trimmed, description: description.trim(), color });
    }
    navigation.goBack();
  };

  const handleDelete = () => {
    if (!existing) return;
    const count = contactsForCategory(existing.id).length;
    Alert.alert(
      'Supprimer cette catégorie ?',
      count > 0
        ? `${count} contact(s) associé(s) resteront mais sans catégorie.`
        : 'Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await deleteCategory(existing.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text style={styles.label}>Nom de la catégorie</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Famille, Travail, Amis..."
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={setName}
          autoFocus={!existing}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Décrivez cette catégorie..."
          placeholderTextColor="#9CA3AF"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={styles.label}>Couleur</Text>
        <View style={styles.colorRow}>
          {CATEGORY_COLORS.map((c) => (
            <Pressable
              key={c}
              onPress={() => setColor(c)}
              style={[styles.swatch, { backgroundColor: c }, color === c && styles.swatchSelected]}
            />
          ))}
        </View>

        <Pressable style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>{existing ? 'Enregistrer' : 'Créer la catégorie'}</Text>
        </Pressable>

        {existing && (
          <Pressable style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.deleteBtnText}>Supprimer la catégorie</Text>
          </Pressable>
        )}
      </ScrollView>
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
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  swatch: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 12,
    marginBottom: 12,
  },
  swatchSelected: {
    borderWidth: 3,
    borderColor: '#111827',
  },
  saveBtn: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  deleteBtn: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 14,
  },
  deleteBtnText: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 15,
  },
});
