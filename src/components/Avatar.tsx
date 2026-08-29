import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { initialsOf } from '../utils/colors';

export default function Avatar({ name, color, size = 48 }: { name: string; color: string; size?: number }) {
  return (
    <View
      style={[
        styles.circle,
        { backgroundColor: color, width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Text style={[styles.initials, { fontSize: size * 0.38 }]}>{initialsOf(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#fff',
    fontWeight: '700',
  },
});
