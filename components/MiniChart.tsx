import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { COLORS } from '../src/constants';

interface MiniChartProps {
  title: string;
  data: { time: number; value: number }[];
  color: string;
  height?: number;
}

const { width } = Dimensions.get('window');

export default function MiniChart({ title, data, color, height = 140 }: MiniChartProps) {
  const chartWidth = width - 40;
  
  const chartData = {
    labels: [],
    datasets: [
      {
        data: data.map(d => Math.max(Math.min(d.value, 100), 0)),
        color: (opacity = 1) => color,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View style={styles.container}>
      {title && (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
        </View>
      )}
      <View style={styles.chartWrapper}>
        <LineChart
          data={chartData}
          width={chartWidth}
          height={height}
          chartConfig={{
            backgroundColor: COLORS.card,
            backgroundGradientFrom: COLORS.card,
            backgroundGradientTo: COLORS.card,
            decimalPlaces: 0,
            color: (opacity = 1) => color,
            labelColor: (opacity = 1) => COLORS.textTertiary,
            propsForDots: {
              r: '0',
            },
            propsForBackgroundLines: {
              strokeWidth: 1,
              stroke: COLORS.border,
              strokeDasharray: '', // solid line
            },
          }}
          bezier
          withInnerLines={false}
          withOuterLines={false}
          withHorizontalLabels={false}
          withVerticalLabels={false}
          style={styles.chart}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textTertiary,
  },
  chartWrapper: {
    marginLeft: -20,
  },
  chart: {
    paddingRight: 0,
  },
});
