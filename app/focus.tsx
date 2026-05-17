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
import { useFocusData } from '../src/hooks/useFocusData';

export default function FocusScreen() {
  const [timeRange, setTimeRange] = useState<'1h' | '24h'>('24h');
  const { fetchFocusAnalysis, focusAnalysis } = useFocusData();

  useEffect(() => {
    fetchFocusAnalysis();
  }, [fetchFocusAnalysis]);

  const stats = [
    { label: '현재', value: focusAnalysis?.avgFocusScore?.toString() || '85', unit: '%' },
    { label: '평균', value: '72', unit: '%' },
    { label: '최고', value: '95', unit: '%' },
    { label: '최저', value: '45', unit: '%' },
  ];

  const data24h = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    value: 60 + Math.sin(i / 3) * 25 + Math.random() * 5,
    id: `24h-${i}`,
  }));

  const data1h = Array.from({ length: 60 }, (_, i) => ({
    time: `${Math.floor(i / 6)}:${(i % 6) * 10}`,
    value: 85 + Math.sin(i / 8) * 15 + Math.random() * 5,
    id: `1h-${i}`,
  }));

  const chartData = timeRange === '24h' ? data24h : data1h;

  const focusPatterns = [
    { time: '09:00 - 12:00', level: '높음', percentage: 88, color: COLORS.success },
    { time: '13:00 - 14:00', level: '낮음', percentage: 45, color: COLORS.warning },
    { time: '15:00 - 18:00', level: '높음', percentage: 82, color: COLORS.success },
  ];

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>집중도 리포트</Text>
          <Text style={styles.currentValue}>85 <Text style={styles.unit}>%</Text></Text>
          <Text style={styles.headerStatus}>좋음 • 현재 집중 모드</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.tipsBox}>
            <MaterialCommunityIcons name="lightbulb-outline" size={20} color={COLORS.primary} />
            <Text style={styles.tipsText}>
              오전 9시 - 12시에 집중력이 가장 높아요. 중요한 일을 이때 계획해보세요!
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
            <DetailChart data={chartData} color={COLORS.focus} height={280} />
          </View>

          <View style={styles.patternsContainer}>
            <Text style={styles.sectionTitle}>오늘의 집중도 패턴</Text>
            {focusPatterns.map((pattern, index) => (
              <View key={index} style={styles.patternItem}>
                <View style={styles.patternInfo}>
                  <Text style={styles.patternTime}>{pattern.time}</Text>
                  <View style={styles.patternBar}>
                    <View
                      style={[
                        styles.patternFill,
                        {
                          width: `${pattern.percentage}%`,
                          backgroundColor: pattern.color,
                        },
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
              <Text style={styles.tipText}>
                매 시간마다 5분씩 휴식을 취해 집중력을 유지하세요.
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                집중도가 낮은 시간대에는 가벼운 업무를 처리하세요.
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
    color: COLORS.primary,
    marginTop: 4,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  tipsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  tipsText: {
    fontSize: 14,
    color: COLORS.primary,
    flex: 1,
    lineHeight: 20,
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
  patternsContainer: {
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
  patternItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  patternInfo: {
    flex: 1,
    marginRight: 12,
  },
  patternTime: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  patternBar: {
    height: 12,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 6,
    overflow: 'hidden',
  },
  patternFill: {
    height: '100%',
    borderRadius: 6,
  },
  patternLevel: {
    alignItems: 'flex-end',
  },
  levelBadge: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  levelPercentage: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  tipsContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tipBullet: {
    fontSize: 20,
    color: COLORS.primary,
    marginRight: 8,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 22,
  },
  bottomSpacer: {
    height: 30,
  },
});
