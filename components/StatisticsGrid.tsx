import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { COLORS } from '../src/constants';

interface Stat {
  label: string;
  value: string;
  unit: string;
}

interface StatisticsGridProps {
  stats: Stat[];
}

const { width } = Dimensions.get('window');
const statWidth = (width - 48) / 2;

export default function StatisticsGrid({ stats }: StatisticsGridProps) {
  return (
    <View style={styles.container}>
      {stats.map((stat, index) => (
        <View key={index} style={[styles.statCard, { width: statWidth }]}>
          <Text style={styles.label}>{stat.label}</Text>
          <View style={styles.valueContainer}>
            <Text style={styles.value}>{stat.value}</Text>
            <Text style={styles.unit}>{stat.unit}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textTertiary,
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
  },
  unit: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textTertiary,
  },
});
