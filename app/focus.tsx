import React, { useState, useMemo } from 'react';
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
import useAppStore from '../src/store/useAppStore';
import {
  buildFocusChartData,
  buildFocusPatterns,
  getCurrentFocusScore,
} from '../src/utils/focusAnalyzer';

function mockFocusData24h() {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    value: 60 + Math.sin(i / 3) * 25 + Math.random() * 5,
    id: `24h-mock-${i}`,
  }));
}

function mockFocusData1h() {
  return Array.from({ length: 60 }, (_, i) => ({
    time: `${Math.floor(i / 6)}:${(i % 6) * 10}`,
    value: 85 + Math.sin(i / 8) * 15 + Math.random() * 5,
    id: `1h-mock-${i}`,
  }));
}

export default function FocusScreen() {
  const [timeRange, setTimeRange] = useState<'1h' | '24h'>('24h');
  const healthHistory = useAppStore((state: any) => state.healthHistory || []);

  const currentFocusScore = useMemo(
    () => getCurrentFocusScore(healthHistory, 10),
    [healthHistory]
  );

  const realChartData = useMemo(() => buildFocusChartData(healthHistory), [healthHistory]);
  const chart1h = realChartData.slice(-60);
  const hasRealData = realChartData.length > 0;

  const chartData = hasRealData
    ? (timeRange === '24h' ? realChartData : chart1h)
    : (timeRange === '24h' ? mockFocusData24h() : mockFocusData1h());

  const hrScores = realChartData.map((d) => d.value);
  const avgFocus = hrScores.length > 0
    ? Math.round(hrScores.reduce((a, b) => a + b, 0) / hrScores.length)
    : 0;
  const maxFocus = hrScores.length > 0 ? Math.max(...hrScores) : 0;
  const minFocus = hrScores.length > 0 ? Math.min(...hrScores) : 0;

  const stats = [
    { label: '현재', value: currentFocusScore > 0 ? currentFocusScore.toString() : '--', unit: '%' },
    { label: '평균', value: avgFocus > 0 ? avgFocus.toString() : '--', unit: '%' },
    { label: '최고', value: maxFocus > 0 ? maxFocus.toString() : '--', unit: '%' },
    { label: '최저', value: minFocus > 0 ? minFocus.toString() : '--', unit: '%' },
  ];

  const realPatterns = useMemo(() => buildFocusPatterns(healthHistory), [healthHistory]);
  const mockPatterns = [
    { time: '09:00 - 12:00', level: '높음' as const, percentage: 88, color: '#4CAF50' },
    { time: '13:00 - 14:00', level: '낮음' as const, percentage: 45, color: '#F44336' },
    { time: '15:00 - 18:00', level: '높음' as const, percentage: 82, color: '#4CAF50' },
  ];
  const focusPatterns = realPatterns.length > 0 ? realPatterns : mockPatterns;

  const focusLabel =
    currentFocusScore >= 70 ? '좋음 • 현재 집중 모드'
    : currentFocusScore >= 40 ? '보통 • 주의 필요'
    : currentFocusScore > 0 ? '낮음 • 휴식 권장'
    : '링을 연결하면 분석됩니다';

  const tipText = hasRealData
    ? `현재 집중도: ${currentFocusScore}%. ${
        currentFocusScore >= 70
          ? '지금이 중요한 업무를 처리하기 좋은 시간입니다!'
          : currentFocusScore >= 40
          ? '집중도가 보통 수준입니다. 잠시 스트레칭을 해보세요.'
          : '집중도가 낮습니다. 5분 휴식 후 다시 시도해보세요.'
      }`
    : '스마트링을 연결하면 심박수 기반 실시간 집중도 분석이 시작됩니다!';

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>집중도 리포트</Text>
          <Text style={styles.currentValue}>
            {currentFocusScore > 0 ? currentFocusScore : '--'}{' '}
            <Text style={styles.unit}>%</Text>
          </Text>
          <Text style={styles.headerStatus}>{focusLabel}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.tipsBox}>
            <MaterialCommunityIcons name="lightbulb-outline" size={20} color={COLORS.primary} />
            <Text style={styles.tipsText}>{tipText}</Text>
          </View>

          <StatisticsGrid stats={stats} />

          <View style={styles.timeRangeSelector}>
            <TouchableOpacity
              style={[styles.timeButton, timeRange === '24h' && styles.timeButtonActive]}
              onPress={() => setTimeRange('24h')}
            >
              <Text style={[styles.timeButtonText, timeRange === '24h' && styles.timeButtonTextActive]}>
                24시간
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.timeButton, timeRange === '1h' && styles.timeButtonActive]}
              onPress={() => setTimeRange('1h')}
            >
              <Text style={[styles.timeButtonText, timeRange === '1h' && styles.timeButtonTextActive]}>
                1시간
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.chartContainer}>
            <DetailChart data={chartData} color={COLORS.focus} height={280} />
            {!hasRealData && (
              <Text style={styles.mockLabel}>* 링 연결 후 실측 데이터로 교체됩니다</Text>
            )}
          </View>

          <View style={styles.patternsContainer}>
            <Text style={styles.sectionTitle}>
              {realPatterns.length > 0 ? '오늘의 집중도 패턴 (실측)' : '오늘의 집중도 패턴'}
            </Text>
            {focusPatterns.map((pattern, index) => (
              <View key={index} style={styles.patternItem}>
                <View style={styles.patternInfo}>
                  <Text style={styles.patternTime}>{pattern.time}</Text>
                  <View style={styles.patternBar}>
                    <View
                      style={[
                        styles.patternFill,
                        { width: `${pattern.percentage}%`, backgroundColor: pattern.color },
                      ]}
                    />
                  </View>
                </View>
                <View style={styles.patternLevel}>
                  <Text style={[styles.levelBadge, { color: pattern.color }]}>
                    {pattern.level}
                  </Text>
                  <Text style={styles.levelPercentage}>{pattern.percentage}%</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.tipsContainer}>
            <Text style={styles.sectionTitle}>집중 팁</Text>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>매 시간마다 5분씩 휴식을 취해 집중력을 유지하세요.</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>집중도가 낮은 시간대에는 가벼운 업무를 처리하세요.</Text>
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </View>
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
  headerStatus: { fontSize: 14, color: COLORS.primary, marginTop: 4 },
  content: { paddingHorizontal: 16, paddingTop: 20 },
  tipsBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primaryLight,
    borderRadius: 16, padding: 16, marginBottom: 20, gap: 12,
  },
  tipsText: { fontSize: 14, color: COLORS.primary, flex: 1, lineHeight: 20, fontWeight: '600' },
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
  patternsContainer: {
    backgroundColor: COLORS.card, borderRadius: 20, padding: 20,
    marginBottom: 24, borderWidth: 1, borderColor: COLORS.border,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 16 },
  patternItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16,
  },
  patternInfo: { flex: 1, marginRight: 12 },
  patternTime: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 6 },
  patternBar: { height: 12, backgroundColor: COLORS.backgroundSecondary, borderRadius: 6, overflow: 'hidden' },
  patternFill: { height: '100%', borderRadius: 6 },
  patternLevel: { alignItems: 'flex-end' },
  levelBadge: { fontSize: 12, fontWeight: '700', marginBottom: 4 },
  levelPercentage: { fontSize: 12, color: COLORS.textTertiary },
  tipsContainer: {
    backgroundColor: COLORS.card, borderRadius: 20, padding: 20,
    marginBottom: 24, borderWidth: 1, borderColor: COLORS.border,
  },
  tipItem: { flexDirection: 'row', marginBottom: 12 },
  tipBullet: { fontSize: 20, color: COLORS.primary, marginRight: 8 },
  tipText: { fontSize: 14, color: COLORS.textSecondary, flex: 1, lineHeight: 22 },
  bottomSpacer: { height: 80 },
});
