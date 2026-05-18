import React, { useState, useMemo } from 'react';
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
import useAppStore from '../src/store/useAppStore';
import {
  analyzeSleep,
  buildWeeklySleepChartData,
  formatMinutes,
} from '../src/utils/sleepAnalyzer';

const STAGE_COLORS = {
  awake: '#FF4D4D',
  light: '#FFBB00',
  deep: '#6255FF',
  rem: '#3182F6',
};

const STAGE_LABELS = {
  awake: '깨어남',
  light: '얕은 수면',
  deep: '깊은 수면',
  rem: 'REM 수면',
};

// Fallback mock week data for when no history exists
const MOCK_WEEK_DATA = [
  { time: '월', value: 7.2, id: 'mock-0' },
  { time: '화', value: 6.8, id: 'mock-1' },
  { time: '수', value: 7.5, id: 'mock-2' },
  { time: '목', value: 7.0, id: 'mock-3' },
  { time: '금', value: 6.2, id: 'mock-4' },
  { time: '토', value: 8.5, id: 'mock-5' },
  { time: '일', value: 7.3, id: 'mock-6' },
];

const MOCK_STAGES = [
  { stage: 'awake' as const, duration: 15, startTime: '', endTime: '' },
  { stage: 'light' as const, duration: 140, startTime: '', endTime: '' },
  { stage: 'deep' as const, duration: 135, startTime: '', endTime: '' },
  { stage: 'rem' as const, duration: 170, startTime: '', endTime: '' },
];

export default function SleepScreen() {
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const healthHistory = useAppStore((state: any) => state.healthHistory || []);

  // --- Analyze sleep from real BLE history ---
  const sleepResult = useMemo(() => analyzeSleep(healthHistory), [healthHistory]);
  const hasRealSleep = sleepResult.hasSleepData;

  // --- Weekly chart data ---
  const realWeekData = useMemo(() => buildWeeklySleepChartData(healthHistory), [healthHistory]);
  const chartData = realWeekData.length > 0 ? realWeekData : MOCK_WEEK_DATA;

  // --- Stage display ---
  const stagesToShow = hasRealSleep ? sleepResult.stages : MOCK_STAGES;
  const totalDuration = hasRealSleep ? sleepResult.totalDuration : 450; // 7.5h fallback

  // Compute percentages for bar
  const stageSummary = stagesToShow.map((s) => ({
    stage: STAGE_LABELS[s.stage],
    duration: formatMinutes(s.duration),
    percentage: totalDuration > 0 ? Math.round((s.duration / totalDuration) * 100) : 0,
    color: STAGE_COLORS[s.stage],
  }));

  // Merge consecutive same-stage entries for the bar display
  const mergedStages = stageSummary.reduce<typeof stageSummary>((acc, cur) => {
    if (acc.length > 0 && acc[acc.length - 1].stage === cur.stage) {
      const last = acc[acc.length - 1];
      acc[acc.length - 1] = {
        ...last,
        percentage: last.percentage + cur.percentage,
      };
    } else {
      acc.push({ ...cur });
    }
    return acc;
  }, []);

  // --- Stats ---
  const totalHours = hasRealSleep ? (totalDuration / 60).toFixed(1) : '7.5';
  const quality = hasRealSleep ? sleepResult.quality : '--';
  const deepMins = hasRealSleep ? sleepResult.deepSleepDuration : 0;
  const remMins = hasRealSleep ? sleepResult.remSleepDuration : 0;

  const stats = [
    { label: '어제 밤', value: totalHours.toString(), unit: '시간' },
    { label: '수면 품질', value: quality.toString(), unit: hasRealSleep ? '%' : '' },
    { label: '깊은 수면', value: hasRealSleep ? formatMinutes(deepMins) : '--', unit: '' },
    { label: 'REM', value: hasRealSleep ? formatMinutes(remMins) : '--', unit: '' },
  ];

  const sleepStatus =
    hasRealSleep
      ? sleepResult.quality >= 70
        ? '매우 좋음 • 충분한 휴식'
        : sleepResult.quality >= 50
        ? '보통 • 수면 개선 권장'
        : '좋지 않음 • 더 많은 수면 필요'
      : '수면 데이터 대기 중';

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>수면 리포트</Text>
          <Text style={styles.currentValue}>
            {totalHours} <Text style={styles.unit}>시간</Text>
          </Text>
          <Text style={styles.headerStatus}>{sleepStatus}</Text>
          {!hasRealSleep && (
            <Text style={styles.mockBadge}>* 야간 수면 데이터 수집 시 자동 갱신</Text>
          )}
        </View>

        <View style={styles.content}>
          <StatisticsGrid stats={stats} />

          <View style={styles.timeRangeSelector}>
            <TouchableOpacity
              style={[styles.timeButton, timeRange === 'week' && styles.timeButtonActive]}
              onPress={() => setTimeRange('week')}
            >
              <Text style={[styles.timeButtonText, timeRange === 'week' && styles.timeButtonTextActive]}>
                이번 주
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.timeButton, timeRange === 'month' && styles.timeButtonActive]}
              onPress={() => setTimeRange('month')}
            >
              <Text style={[styles.timeButtonText, timeRange === 'month' && styles.timeButtonTextActive]}>
                이번 달
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.chartContainer}>
            <DetailChart data={chartData} color={COLORS.sleep} height={280} />
            {realWeekData.length === 0 && (
              <Text style={styles.mockLabel}>* 링 착용 후 수면 데이터가 누적되면 표시됩니다</Text>
            )}
          </View>

          <View style={styles.stagesContainer}>
            <Text style={styles.sectionTitle}>
              {hasRealSleep ? '수면 단계 (실측)' : '수면 단계'}
            </Text>
            <View style={styles.stageBar}>
              {mergedStages.map((stage, index) => (
                <View
                  key={index}
                  style={[
                    styles.stageFill,
                    { width: `${stage.percentage}%`, backgroundColor: stage.color },
                  ]}
                />
              ))}
            </View>
            <View style={styles.stageList}>
              {mergedStages.map((stage, index) => (
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
  root: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: COLORS.textSecondary },
  currentValue: { fontSize: 48, fontWeight: '700', color: COLORS.text, marginTop: 8 },
  unit: { fontSize: 24, fontWeight: '500', color: COLORS.textTertiary },
  headerStatus: { fontSize: 14, color: COLORS.sleep, marginTop: 4 },
  mockBadge: { fontSize: 11, color: COLORS.textTertiary, marginTop: 6 },
  content: { paddingHorizontal: 16, paddingTop: 20 },
  timeRangeSelector: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  timeButton: {
    flex: 1, paddingVertical: 10, paddingHorizontal: 16,
    backgroundColor: COLORS.backgroundSecondary, borderRadius: 12, alignItems: 'center',
  },
  timeButtonActive: { backgroundColor: COLORS.primary },
  timeButtonText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  timeButtonTextActive: { color: COLORS.card },
  chartContainer: {
    marginBottom: 24, backgroundColor: COLORS.card, borderRadius: 20,
    padding: 16, borderWidth: 1, borderColor: COLORS.border,
  },
  mockLabel: { fontSize: 11, color: COLORS.textTertiary, textAlign: 'center', marginTop: 8 },
  stagesContainer: {
    backgroundColor: COLORS.card, borderRadius: 20, padding: 20,
    marginBottom: 24, borderWidth: 1, borderColor: COLORS.border,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 16 },
  stageBar: { height: 12, flexDirection: 'row', borderRadius: 6, overflow: 'hidden', marginBottom: 20 },
  stageFill: { height: '100%' },
  stageList: { gap: 12 },
  stageItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stageInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stageDot: { width: 8, height: 8, borderRadius: 4 },
  stageName: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '500' },
  stageDuration: { fontSize: 14, color: COLORS.text, fontWeight: '600' },
  bottomSpacer: { height: 80 },
});
