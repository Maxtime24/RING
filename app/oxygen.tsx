import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DetailChart from '../components/DetailChart';
import StatisticsGrid from '../components/StatisticsGrid';
import { COLORS } from '../src/constants';
import { useHealthData } from '../src/hooks/useHealthData';
import useAppStore from '../src/store/useAppStore';

export default function OxygenScreen() {
  const [timeRange, setTimeRange] = useState<'1h' | '24h'>('24h');
  const { fetchCurrentHealth } = useHealthData();
  const currentHealth = useAppStore((state: any) => state.currentHealth);
  const healthHistory = useAppStore((state: any) => state.healthHistory || []);

  useEffect(() => {
    fetchCurrentHealth();
  }, [fetchCurrentHealth]);

  const currentO2 = currentHealth?.oxygenLevel || '--';

  const stats = [
    { label: '현재', value: currentO2.toString(), unit: '%' },
    { label: '평균', value: '97', unit: '%' },
    { label: '최고', value: '99', unit: '%' },
    { label: '최저', value: '94', unit: '%' },
  ];

  const realChartData = healthHistory
    .filter((d: any) => d.oxygenLevel > 0)
    .map((d: any) => {
      const date = new Date(d.timestamp);
      const hours = date.getHours().toString().padStart(2, '0');
      const mins = date.getMinutes().toString().padStart(2, '0');
      return {
        time: `${hours}:${mins}`,
        value: d.oxygenLevel,
        id: d.timestamp,
      };
    });

  const mockData24h = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    value: 95 + Math.sin(i / 5) * 3 + Math.random() * 2,
    id: `24h-${i}`,
  }));

  const mockData1h = Array.from({ length: 60 }, (_, i) => ({
    time: `${Math.floor(i / 6)}:${(i % 6) * 10}`,
    value: 98 + Math.sin(i / 15) * 2 + Math.random() * 1,
    id: `1h-${i}`,
  }));

  const chartData = realChartData.length > 0 
    ? realChartData 
    : (timeRange === '24h' ? mockData24h : mockData1h);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>혈중 산소도 리포트</Text>
          <Text style={styles.currentValue}>{currentO2} <Text style={styles.unit}>%</Text></Text>
          <Text style={styles.headerStatus}>매우 좋음 • 정상 범위</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.alertBox}>
            <MaterialCommunityIcons name="check-circle" size={20} color={COLORS.success} />
            <Text style={styles.alertText}>
              산소 포화도가 건강한 수준입니다. 현재 상태를 잘 유지하고 계시네요!
            </Text>
          </View>

          <StatisticsGrid stats={stats} />

          <View style={styles.timeRangeSelector}>
            <TouchableOpacity
              style={[
                styles.timeButton,
                timeRange === '24h' && styles.timeButtonActive,
              ]}
              onPress={() => setTimeRange('24h')}
            >
              <Text
                style={[
                  styles.timeButtonText,
                  timeRange === '24h' && styles.timeButtonTextActive,
                ]}
              >
                24시간
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.timeButton,
                timeRange === '1h' && styles.timeButtonActive,
              ]}
              onPress={() => setTimeRange('1h')}
            >
              <Text
                style={[
                  styles.timeButtonText,
                  timeRange === '1h' && styles.timeButtonTextActive,
                ]}
              >
                1시간
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.chartContainer}>
            <DetailChart data={chartData} color={COLORS.oxygen} height={280} />
          </View>

          <View style={styles.rangeContainer}>
            <Text style={styles.sectionTitle}>산소 포화도 범위</Text>
            <View style={styles.rangeItem}>
              <View style={[styles.rangeIndicator, { backgroundColor: COLORS.success }]} />
              <View style={styles.rangeContent}>
                <Text style={styles.rangeLabel}>매우 좋음</Text>
                <Text style={styles.rangeValue}>95-100%</Text>
              </View>
            </View>
            <View style={styles.rangeItem}>
              <View style={[styles.rangeIndicator, { backgroundColor: COLORS.warning }]} />
              <View style={styles.rangeContent}>
                <Text style={styles.rangeLabel}>정상</Text>
                <Text style={styles.rangeValue}>90-94%</Text>
              </View>
            </View>
            <View style={styles.rangeItem}>
              <View style={[styles.rangeIndicator, { backgroundColor: COLORS.heart }]} />
              <View style={styles.rangeContent}>
                <Text style={styles.rangeLabel}>주의 필요</Text>
                <Text style={styles.rangeValue}>90% 미만</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  currentValue: {
    fontSize: 48,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 8,
  },
  unit: {
    fontSize: 24,
    fontWeight: '500',
    color: COLORS.textTertiary,
  },
  headerStatus: {
    fontSize: 14,
    color: COLORS.oxygen,
    marginTop: 4,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  alertText: {
    fontSize: 14,
    color: '#2E7D32',
    flex: 1,
    lineHeight: 22,
    fontWeight: '600',
  },
  timeRangeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  timeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    alignItems: 'center',
  },
  timeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  timeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  timeButtonTextActive: {
    color: COLORS.card,
  },
  chartContainer: {
    marginBottom: 24,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  rangeContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  rangeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rangeIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  rangeContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rangeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  rangeValue: {
    fontSize: 13,
    color: COLORS.textTertiary,
  },
  bottomSpacer: {
    height: 30,
  },
});
