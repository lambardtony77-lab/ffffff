import React, { useLayoutEffect, useMemo } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ContactsStackParamList } from '../navigation/types';
import { useData } from '../context/DataContext';
import Avatar from '../components/Avatar';

type Props = NativeStackScreenProps<ContactsStackParamList, 'ContactDetail'>;

export default function ContactDetailScreen({ navigation, route }: Props) {
  const { contacts, categories, deleteContact } = useData();
  const contact = useMemo(
    () => contacts.find((c) => c.id === route.params.contactId),
    [contacts, route.params.contactId]
  );
  const category = categories.find((c) => c.id === contact?.categoryId);

  useLayoutEffect(() => {
    if (!contact) return;
    navigation.setOptions({
      title: contact.name,
      headerRight: () => (
        <Pressable onPress={() => navigation.navigate('ContactForm', { contactId: contact.id })}>
          <Text style={styles.headerAction}>Modifier</Text>
        </Pressable>
      ),
    });
  }, [navigation, contact]);

  if (!contact) {
    return (
      <View style={styles.container}>
        <Text style={styles.missing}>Ce contact n'existe plus.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert('Supprimer ce contact ?', `Cette action est irréversible.`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          await deleteContact(contact.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <View style={styles.header}>
        <Avatar name={contact.name} color={category?.color ?? '#9CA3AF'} size={72} />
        <Text style={styles.name}>{contact.name}</Text>
        {category ? (
          <View style={[styles.categoryBadge, { backgroundColor: category.color + '22' }]}>
            <View style={[styles.dot, { backgroundColor: category.color }]} />
            <Text style={[styles.categoryBadgeText, { color: category.color }]}>{category.name}</Text>
          </View>
        ) : (
          <Text style={styles.noCategory}>Sans catégorie</Text>
        )}
        {!!category?.description && <Text style={styles.categoryDescription}>{category.description}</Text>}
      </View>

      {!!contact.phone && (
        <Pressable style={styles.row} onPress={() => Linking.openURL(`tel:${contact.phone}`)}>
          <Text style={styles.rowLabel}>Téléphone</Text>
          <Text style={styles.rowValue}>{contact.phone}</Text>
        </Pressable>
      )}
      {!!contact.email && (
        <Pressable style={styles.row} onPress={() => Linking.openURL(`mailto:${contact.email}`)}>
          <Text style={styles.rowLabel}>Email</Text>
          <Text style={styles.rowValue}>{contact.email}</Text>
        </Pressable>
      )}
      {!!contact.notes && (
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Notes</Text>
          <Text style={styles.rowValue}>{contact.notes}</Text>
        </View>
      )}

      <Pressable style={styles.deleteBtn} onPress={handleDelete}>
        <Text style={styles.deleteBtnText}>Supprimer le contact</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  headerAction: {
    color: '#4F46E5',
    fontWeight: '600',
    fontSize: 15,
  },
  missing: {
    padding: 20,
    color: '#9CA3AF',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginTop: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 8,
  },
  categoryBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  categoryDescription: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 6,
    textAlign: 'center',
  },
  noCategory: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  row: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  rowLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
    marginBottom: 4,
  },
  rowValue: {
    fontSize: 15,
    color: '#111827',
  },
  deleteBtn: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 14,
  },
  deleteBtnText: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 15,
  },
});
