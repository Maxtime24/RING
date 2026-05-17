import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DetailChart from '../components/DetailChart';
import StatisticsGrid from '../components/StatisticsGrid';
import { COLORS } from '../src/constants';
import { useHealthData } from '../src/hooks/useHealthData';
import useAppStore from '../src/store/useAppStore';

export default function HeartRateScreen() {
  const [timeRange, setTimeRange] = useState<'1h' | '24h'>('24h');
  const { fetchCurrentHealth } = useHealthData();
  const currentHealth = useAppStore((state: any) => state.currentHealth);

  useEffect(() => {
    fetchCurrentHealth();
  }, [fetchCurrentHealth]);

  const stats = [
    { label: '현재', value: currentHealth?.heartRate?.toString() || '72', unit: 'bpm' },
    { label: '평균', value: '68', unit: 'bpm' },
    { label: '최고', value: '95', unit: 'bpm' },
    { label: '최저', value: '58', unit: 'bpm' },
  ];

  const data24h = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    value: 60 + Math.sin(i / 4) * 20 + Math.random() * 10,
    id: `24h-${i}`,
  }));

  const data1h = Array.from({ length: 60 }, (_, i) => ({
    time: `${Math.floor(i / 6)}:${(i % 6) * 10}`,
    value: 72 + Math.sin(i / 10) * 5 + Math.random() * 3,
    id: `1h-${i}`,
  }));

  const chartData = timeRange === '24h' ? data24h : data1h;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>심박수 리포트</Text>
          <Text style={styles.currentValue}>72 <Text style={styles.unit}>bpm</Text></Text>
          <Text style={styles.headerStatus}>정상 • 안정적임</Text>
        </View>

        <View style={styles.content}>
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
            <DetailChart data={chartData} color={COLORS.heart} height={280} />
          </View>

          <View style={styles.insightsContainer}>
            <Text style={styles.insightsTitle}>오늘의 인사이트</Text>
            <View style={styles.insightItem}>
              <Text style={styles.insightBullet}>•</Text>
              <Text style={styles.insightText}>
                심박수가 하루 종일 평균 68 bpm으로 안정적인 상태를 유지했습니다.
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Text style={styles.insightBullet}>•</Text>
              <Text style={styles.insightText}>
                오후 3시 운동 중에 최고 심박수 95 bpm에 도달했습니다.
              </Text>
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </View>
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
    color: COLORS.heart,
    marginTop: 4,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
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
  insightsContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  insightItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  insightBullet: {
    fontSize: 20,
    color: COLORS.heart,
    marginRight: 8,
  },
  insightText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 22,
  },
  bottomSpacer: {
    height: 30,
  },
});
