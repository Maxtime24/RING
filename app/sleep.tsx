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
import { useSleepData } from '../src/hooks/useSleepData';

export default function SleepScreen() {
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const { fetchTodaySleep, todaySleep } = useSleepData();

  useEffect(() => {
    fetchTodaySleep();
  }, [fetchTodaySleep]);

  const stats = [
    { label: '어제 밤', value: todaySleep?.totalDuration ? (todaySleep.totalDuration / 60).toFixed(1) : '7.5', unit: '시간' },
    { label: '주간 평균', value: '7.2', unit: '시간' },
    { label: '최고 기록', value: '8.5', unit: '시간' },
    { label: '최저 기록', value: '6.2', unit: '시간' },
  ];

  const weekData = [
    { time: '월', value: 7.2 },
    { time: '화', value: 6.8 },
    { time: '수', value: 7.5 },
    { time: '목', value: 7.0 },
    { time: '금', value: 6.2 },
    { time: '토', value: 8.5 },
    { time: '일', value: 7.3 },
  ].map((d, i) => ({ ...d, id: `week-${i}` }));

  const chartData = weekData; // Simple MVP data

  const sleepStages = [
    { stage: '깨어남', duration: '15분', percentage: 3, color: '#FF4D4D' },
    { stage: '얕은 수면', duration: '2시간 20분', percentage: 31, color: '#FFBB00' },
    { stage: '깊은 수면', duration: '2시간 15분', percentage: 30, color: '#6255FF' },
    { stage: 'REM 수면', duration: '2시간 50분', percentage: 38, color: '#3182F6' },
  ];

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>수면 리포트</Text>
          <Text style={styles.currentValue}>7.5 <Text style={styles.unit}>시간</Text></Text>
          <Text style={styles.headerStatus}>매우 좋음 • 충분한 휴식</Text>
        </View>

        <View style={styles.content}>
          <StatisticsGrid stats={stats} />

          <View style={styles.timeRangeSelector}>
            <TouchableOpacity
              style={[
                styles.timeButton,
                timeRange === 'week' && styles.timeButtonActive,
              ]}
              onPress={() => setTimeRange('week')}
            >
              <Text
                style={[
                  styles.timeButtonText,
                  timeRange === 'week' && styles.timeButtonTextActive,
                ]}
              >
                이번 주
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.timeButton,
                timeRange === 'month' && styles.timeButtonActive,
              ]}
              onPress={() => setTimeRange('month')}
            >
              <Text
                style={[
                  styles.timeButtonText,
                  timeRange === 'month' && styles.timeButtonTextActive,
                ]}
              >
                이번 달
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.chartContainer}>
            <DetailChart data={chartData} color={COLORS.sleep} height={280} />
          </View>

          <View style={styles.stagesContainer}>
            <Text style={styles.sectionTitle}>수면 단계</Text>
            <View style={styles.stageBar}>
              {sleepStages.map((stage, index) => (
                <View
                  key={index}
                  style={[
                    styles.stageFill,
                    {
                      width: `${stage.percentage}%`,
                      backgroundColor: stage.color,
                    },
                  ]}
                />
              ))}
            </View>
            <View style={styles.stageList}>
              {sleepStages.map((stage, index) => (
                <View key={index} style={styles.stageItem}>
                  <View style={styles.stageInfo}>
                    <View style={[styles.stageDot, { backgroundColor: stage.color }]} />
                    <Text style={styles.stageName}>{stage.stage}</Text>
                  </View>
                  <Text style={styles.stageDuration}>{stage.duration}</Text>
                </View>
              ))}
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
    color: COLORS.sleep,
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
  stagesContainer: {
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
  stageBar: {
    height: 12,
    flexDirection: 'row',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 20,
  },
  stageFill: {
    height: '100%',
  },
  stageList: {
    gap: 12,
  },
  stageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stageName: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  stageDuration: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 30,
  },
});
