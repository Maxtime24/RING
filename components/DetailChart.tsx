import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { COLORS } from '../src/constants';

interface DetailChartProps {
  data: { time: string; value: number; id: string }[];
  color: string;
  height?: number;
}

const { width } = Dimensions.get('window');

export default function DetailChart({ data, color, height = 280 }: DetailChartProps) {
  const chartWidth = width - 40;

  const chartData = {
    labels: data.map((_, i) => (i % Math.ceil(data.length / 6) === 0 ? data[i].time : '')),
    datasets: [
      {
        data: data.map(d => d.value),
        color: (opacity = 1) => color,
        strokeWidth: 3,
      },
    ],
  };

  return (
    <View style={styles.container}>
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
            r: '4',
            strokeWidth: '2',
            stroke: '#fff',
            fill: color,
          },
          propsForBackgroundLines: {
            stroke: COLORS.border,
            strokeDasharray: '5',
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginLeft: -10,
  },
  chart: {
    borderRadius: 20,
  },
});
