import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

export default function Fab({ onPress, label = '+' }: { onPress: () => void; label?: string }) {
  return (
    <Pressable style={({ pressed }) => [styles.fab, pressed && styles.pressed]} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    color: '#fff',
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '400',
  },
});
