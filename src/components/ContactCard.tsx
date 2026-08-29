import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Contact, Category } from '../types';
import Avatar from './Avatar';

export default function ContactCard({
  contact,
  category,
  onPress,
}: {
  contact: Contact;
  category?: Category;
  onPress: () => void;
}) {
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]} onPress={onPress}>
      <Avatar name={contact.name} color={category?.color ?? '#9CA3AF'} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {contact.name}
        </Text>
        {!!contact.phone && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {contact.phone}
          </Text>
        )}
        {category ? (
          <View style={[styles.badge, { backgroundColor: category.color + '22' }]}>
            <View style={[styles.dot, { backgroundColor: category.color }]} />
            <Text style={[styles.badgeText, { color: category.color }]} numberOfLines={1}>
              {category.name}
            </Text>
          </View>
        ) : (
          <Text style={styles.noCategory}>Sans catégorie</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  noCategory: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 6,
  },
});
