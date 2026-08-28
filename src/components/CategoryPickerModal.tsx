import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Category } from '../types';
import { useData } from '../context/DataContext';
import { CATEGORY_COLORS } from '../utils/colors';

export default function CategoryPickerModal({
  visible,
  selectedCategoryId,
  onClose,
  onSelect,
}: {
  visible: boolean;
  selectedCategoryId: string | null;
  onClose: () => void;
  onSelect: (categoryId: string | null) => void;
}) {
  const { categories, addCategory } = useData();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(CATEGORY_COLORS[0]);

  const resetCreateForm = () => {
    setCreating(false);
    setName('');
    setDescription('');
    setColor(CATEGORY_COLORS[0]);
  };

  const handleCreate = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const category = await addCategory({ name: trimmed, description: description.trim(), color });
    resetCreateForm();
    onSelect(category.id);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Choisir une catégorie</Text>

          <ScrollView style={{ maxHeight: 320 }}>
            <Pressable
              style={[styles.option, selectedCategoryId === null && styles.optionSelected]}
              onPress={() => onSelect(null)}
            >
              <View style={[styles.dot, { backgroundColor: '#9CA3AF' }]} />
              <Text style={styles.optionText}>Sans catégorie</Text>
            </Pressable>

            {categories.map((cat) => (
              <Pressable
                key={cat.id}
                style={[styles.option, selectedCategoryId === cat.id && styles.optionSelected]}
                onPress={() => onSelect(cat.id)}
              >
                <View style={[styles.dot, { backgroundColor: cat.color }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.optionText}>{cat.name}</Text>
                  {!!cat.description && (
                    <Text style={styles.optionDescription} numberOfLines={1}>
                      {cat.description}
                    </Text>
                  )}
                </View>
              </Pressable>
            ))}
          </ScrollView>

          {creating ? (
            <View style={styles.createForm}>
              <TextInput
                style={styles.input}
                placeholder="Nom de la catégorie"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={[styles.input, styles.multiline]}
                placeholder="Description"
                placeholderTextColor="#9CA3AF"
                value={description}
                onChangeText={setDescription}
                multiline
              />
              <View style={styles.colorRow}>
                {CATEGORY_COLORS.map((c) => (
                  <Pressable
                    key={c}
                    onPress={() => setColor(c)}
                    style={[
                      styles.swatch,
                      { backgroundColor: c },
                      color === c && styles.swatchSelected,
                    ]}
                  />
                ))}
              </View>
              <View style={styles.createActions}>
                <Pressable style={styles.secondaryBtn} onPress={resetCreateForm}>
                  <Text style={styles.secondaryBtnText}>Annuler</Text>
                </Pressable>
                <Pressable
                  style={[styles.primaryBtn, !name.trim() && styles.disabled]}
                  onPress={handleCreate}
                  disabled={!name.trim()}
                >
                  <Text style={styles.primaryBtnText}>Créer</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable style={styles.newCategoryBtn} onPress={() => setCreating(true)}>
              <Text style={styles.newCategoryText}>+ Nouvelle catégorie</Text>
            </Pressable>
          )}

          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Fermer</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  optionSelected: {
    backgroundColor: '#EEF2FF',
  },
  optionText: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },
  optionDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 1,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  newCategoryBtn: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  newCategoryText: {
    color: '#4F46E5',
    fontWeight: '600',
    fontSize: 15,
  },
  createForm: {
    paddingTop: 8,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
    marginBottom: 10,
  },
  multiline: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 10,
    marginBottom: 10,
  },
  swatchSelected: {
    borderWidth: 3,
    borderColor: '#111827',
  },
  createActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  secondaryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  secondaryBtnText: {
    color: '#6B7280',
    fontWeight: '600',
  },
  primaryBtn: {
    backgroundColor: '#4F46E5',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  disabled: {
    opacity: 0.5,
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  closeBtn: {
    marginTop: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#9CA3AF',
    fontWeight: '500',
  },
});
