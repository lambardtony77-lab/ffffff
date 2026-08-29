import React, { useLayoutEffect, useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CategoriesStackParamList } from '../navigation/types';
import { useData } from '../context/DataContext';
import EmptyState from '../components/EmptyState';
import Avatar from '../components/Avatar';

type Props = NativeStackScreenProps<CategoriesStackParamList, 'CategoryContacts'>;

export default function CategoryContactsScreen({ navigation, route }: Props) {
  const { categories, contactsForCategory } = useData();
  const category = categories.find((c) => c.id === route.params.categoryId);
  const contacts = useMemo(
    () =>
      contactsForCategory(route.params.categoryId).sort((a, b) => a.name.localeCompare(b.name)),
    [contactsForCategory, route.params.categoryId]
  );

  useLayoutEffect(() => {
    navigation.setOptions({ title: category?.name ?? 'Catégorie' });
  }, [navigation, category]);

  if (!category) {
    return (
      <View style={styles.container}>
        <Text style={styles.missing}>Cette catégorie n'existe plus.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!!category.description && (
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionText}>{category.description}</Text>
        </View>
      )}
      {contacts.length === 0 ? (
        <EmptyState title="Aucun contact" subtitle="Aucune fiche n'est associée à cette catégorie pour l'instant." />
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Avatar name={item.name} color={category.color} size={40} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.name}>{item.name}</Text>
                {!!item.phone && <Text style={styles.phone}>{item.phone}</Text>}
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  missing: {
    padding: 20,
    color: '#9CA3AF',
  },
  descriptionBox: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
  },
  descriptionText: {
    color: '#6B7280',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  phone: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
});
