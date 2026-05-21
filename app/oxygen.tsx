import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DetailChart from '../components/DetailChart';
import StatisticsGrid from '../components/StatisticsGrid';
import { COLORS } from '../src/constants';
import { useHealthData } from '../src/hooks/useHealthData';
import { useMeasurement } from '../src/hooks/useMeasurement';
import useAppStore from '../src/store/useAppStore';

export default function OxygenScreen() {
  const [timeRange, setTimeRange] = useState<'1h' | '24h'>('24h');
  const { fetchCurrentHealth } = useHealthData();
  const currentHealth = useAppStore((state: any) => state.currentHealth);
  const healthHistory = useAppStore((state: any) => state.healthHistory || []);
  
  const { isMeasuringO2, lastO2MeasuredAt, measureOxygen } = useMeasurement();
  const bleConnection = useAppStore((state: any) => state.bleConnection);

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

  // Group data by hour and calculate average for 24h view
  const getHourlyData = () => {
    if (healthHistory.length === 0) {
      return timeRange === '24h' 
        ? Array.from({ length: 24 }, (_, i) => ({
            time: `${i.toString().padStart(2, '0')}:00`,
            value: null,
            id: `24h-${i}`,
          }))
        : Array.from({ length: 60 }, (_, i) => ({
            time: `${Math.floor(i / 6)}:${(i % 6) * 10}`,
            value: null,
            id: `1h-${i}`,
          }));
    }

    if (timeRange === '24h') {
      const hourlyGroups: Record<number, number[]> = {};
      
      // Group measurements by hour
      healthHistory.forEach((d: any) => {
        if (d.oxygenLevel > 0) {
          const date = new Date(d.timestamp);
          const hour = date.getHours();
          if (!hourlyGroups[hour]) hourlyGroups[hour] = [];
          hourlyGroups[hour].push(d.oxygenLevel);
        }
      });
      
      // Create hourly data points with averages
      return Array.from({ length: 24 }, (_, i) => {
        const values = hourlyGroups[i] || [];
        const avgValue = values.length > 0 
          ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
          : null;
        return {
          time: `${i.toString().padStart(2, '0')}:00`,
          value: avgValue,
          id: `24h-${i}`,
        };
      });
    } else {
      // For 1-hour view, show minute-by-minute data from last hour
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 3600000);
      
      const minuteGroups: Record<number, number[]> = {};
      
      healthHistory.forEach((d: any) => {
        const date = new Date(d.timestamp);
        if (date >= oneHourAgo && d.oxygenLevel > 0) {
          const diffMs = date.getTime() - oneHourAgo.getTime();
          const minute = Math.floor(diffMs / 60000);
          if (!minuteGroups[minute]) minuteGroups[minute] = [];
          minuteGroups[minute].push(d.oxygenLevel);
        }
      });
      
      // Create minute-by-minute data
      return Array.from({ length: 60 }, (_, i) => {
        const values = minuteGroups[i] || [];
        const avgValue = values.length > 0 
          ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
          : null;
        const startMin = oneHourAgo.getMinutes() + i;
        const displayHour = oneHourAgo.getHours();
        const displayMin = startMin % 60;
        return {
          time: `${displayHour.toString().padStart(2, '0')}:${displayMin.toString().padStart(2, '0')}`,
          value: avgValue,
          id: `1h-${i}`,
        };
      });
    }
  };

  const chartData = getHourlyData();

  const formatTime = (isoString: string | null) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? '오후' : '오전';
    const displayHours = hours % 12 || 12;
    return `${ampm} ${displayHours}:${minutes}`;
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>혈중 산소도 리포트</Text>
          <Text style={styles.currentValue}>{currentO2} <Text style={styles.unit}>%</Text></Text>
          <Text style={styles.headerStatus}>
            {isMeasuringO2 ? '산소 포화도 측정 시작됨' : '매우 좋음 • 정상 범위'}
          </Text>

          {/* 측정 제어 버튼 */}
          <TouchableOpacity
            style={[
              styles.measureButton,
              isMeasuringO2 && styles.measureButtonActive,
              !bleConnection.isConnected && styles.measureButtonDisabled,
            ]}
            onPress={measureOxygen}
            disabled={isMeasuringO2 || !bleConnection.isConnected}
          >
            <Text style={isMeasuringO2 ? styles.measureButtonTextActive : styles.measureButtonText}>
              {isMeasuringO2 
                ? '측정 중 (60초)...' 
                : bleConnection.isConnected 
                  ? '지금 측정하기' 
                  : '링을 연결해주세요'
              }
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* 실시간 측정 상태 배너 */}
          {bleConnection.isConnected && (
            <View style={[styles.statusBanner, isMeasuringO2 && styles.statusBannerActive]}>
              <Text style={styles.statusBannerText}>
                {isMeasuringO2 
                  ? '⚡ 스마트링에서 실시간 산소포화도 측정 신호를 처리하고 있습니다.' 
                  : lastO2MeasuredAt 
                    ? `✓ 최근 측정 완료: ${formatTime(lastO2MeasuredAt)} (10분 주기로 자동 측정)` 
                    : '⏳ 10분 주기로 자동 건강 측정이 동작 중입니다.'
                }
              </Text>
            </View>
          )}

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
  measureButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 28,
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  measureButtonActive: {
    backgroundColor: COLORS.oxygen,
    shadowColor: COLORS.oxygen,
  },
  measureButtonDisabled: {
    backgroundColor: COLORS.textTertiary,
    shadowColor: 'transparent',
    elevation: 0,
  },
  measureButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  measureButtonTextActive: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  statusBanner: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusBannerActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  statusBannerText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
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
    height: 80,
  },
});

