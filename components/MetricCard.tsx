import React from 'react';
import { View, StyleSheet, Text, Dimensions, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../src/constants';

interface MetricCardProps {
  title: string;
  value: number | string;
  unit: string;
  status: string;
  color: string;
  icon: any;
  onPress?: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export default function MetricCard({
  title,
  value,
  unit,
  status,
  color,
  icon,
  onPress,
}: MetricCardProps) {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container, 
        { width: cardWidth },
        pressed && styles.pressed
      ]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <MaterialCommunityIcons name={icon} size={20} color={color} />
        </View>

        <View style={styles.valueRow}>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.unit}>{unit}</Text>
        </View>
        
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: color }]} />
          <Text style={[styles.statusText, { color: color }]}>{status}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  pressed: {
    backgroundColor: COLORS.backgroundSecondary,
    opacity: 0.8,
  },
  content: {
    justifyContent: 'space-between',
    minHeight: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  unit: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textTertiary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
