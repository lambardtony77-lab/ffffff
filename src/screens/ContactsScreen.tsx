import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ContactsStackParamList } from '../navigation/types';
import { useData } from '../context/DataContext';
import ContactCard from '../components/ContactCard';
import EmptyState from '../components/EmptyState';
import Fab from '../components/Fab';

type Props = NativeStackScreenProps<ContactsStackParamList, 'ContactsList'>;

export default function ContactsScreen({ navigation }: Props) {
  const { contacts, categories } = useData();
  const [query, setQuery] = useState('');

  const categoriesById = useMemo(() => {
    const map = new Map(categories.map((c) => [c.id, c]));
    return map;
  }, [categories]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...contacts].sort((a, b) => a.name.localeCompare(b.name));
    if (!q) return sorted;
    return sorted.filter((c) => {
      const category = c.categoryId ? categoriesById.get(c.categoryId) : undefined;
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (category?.name.toLowerCase().includes(q) ?? false)
      );
    });
  }, [contacts, query, categoriesById]);

  return (
    <View style={styles.container}>
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.search}
          placeholder="Rechercher un contact..."
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery}
          clearButtonMode="while-editing"
        />
      </View>
      {filtered.length === 0 ? (
        <EmptyState
          title={contacts.length === 0 ? 'Aucun contact' : 'Aucun résultat'}
          subtitle={
            contacts.length === 0
              ? "Appuyez sur + pour créer votre première fiche contact."
              : 'Essayez une autre recherche.'
          }
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <ContactCard
              contact={item}
              category={item.categoryId ? categoriesById.get(item.categoryId) : undefined}
              onPress={() => navigation.navigate('ContactDetail', { contactId: item.id })}
            />
          )}
        />
      )}
      <Fab onPress={() => navigation.navigate('ContactForm', undefined)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  searchWrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  search: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
  },
});
