import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CategoriesStackParamList } from '../navigation/types';
import { useData } from '../context/DataContext';
import EmptyState from '../components/EmptyState';
import Fab from '../components/Fab';

type Props = NativeStackScreenProps<CategoriesStackParamList, 'CategoriesList'>;

export default function CategoriesScreen({ navigation }: Props) {
  const { categories, contactsForCategory } = useData();
  const sorted = [...categories].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <View style={styles.container}>
      {sorted.length === 0 ? (
        <EmptyState
          title="Aucune catégorie"
          subtitle="Créez des catégories pour organiser vos fiches contact (famille, travail, amis...)."
        />
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
          renderItem={({ item }) => {
            const count = contactsForCategory(item.id).length;
            return (
              <Pressable
                style={({ pressed }) => [styles.card, pressed && styles.pressed]}
                onPress={() => navigation.navigate('CategoryContacts', { categoryId: item.id })}
              >
                <View style={[styles.colorBar, { backgroundColor: item.color }]} />
                <View style={styles.info}>
                  <View style={styles.titleRow}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.count}>{count}</Text>
                  </View>
                  <Text style={styles.description} numberOfLines={2}>
                    {item.description || 'Aucune description'}
                  </Text>
                </View>
                <Pressable
                  hitSlop={10}
                  onPress={() => navigation.navigate('CategoryForm', { categoryId: item.id })}
                >
                  <Text style={styles.editLink}>Modifier</Text>
                </Pressable>
              </Pressable>
            );
          }}
        />
      )}
      <Fab onPress={() => navigation.navigate('CategoryForm', undefined)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    overflow: 'hidden',
    paddingRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  colorBar: {
    width: 6,
    alignSelf: 'stretch',
  },
  info: {
    flex: 1,
    paddingVertical: 14,
    paddingLeft: 14,
    paddingRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  count: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  editLink: {
    color: '#4F46E5',
    fontSize: 13,
    fontWeight: '600',
  },
});
