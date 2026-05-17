import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MetricCard from '../components/MetricCard';
import MiniChart from '../components/MiniChart';
import { COLORS, TYPOGRAPHY } from '../src/constants';
import { useBle } from '../src/hooks/useBle';
import useAppStore from '../src/store/useAppStore';
import { useHealthData } from '../src/hooks/useHealthData';
import { generateSleepForecast } from '../src/utils/sleepModels';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { bleConnection, bleDevices, scanDevices, connectToDevice, disconnectDevice } = useBle();
  const { fetchCurrentHealth } = useHealthData();
  const currentHealth = useAppStore((state: any) => state.currentHealth);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchCurrentHealth();
  }, [fetchCurrentHealth]);

  const sleepForecast = useMemo(() => {
    return generateSleepForecast(7, new Date().getHours());
  }, []);

  const currentAlertness = sleepForecast[0].alertness.toFixed(0);

  const handleConnect = async (deviceId: string) => {
    try {
      await connectToDevice(deviceId);
      setModalVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>안녕하세요,</Text>
            <Text style={styles.userName}>건강 탐험가님</Text>
          </View>
          <TouchableOpacity 
            style={[styles.connectButton, bleConnection.isConnected && styles.connectedButton]}
            onPress={() => bleConnection.isConnected ? disconnectDevice(bleConnection.device?.id!) : setModalVisible(true)}
          >
            <MaterialCommunityIcons 
              name={bleConnection.isConnected ? "ring" : "plus"} 
              size={20} 
              color={bleConnection.isConnected ? COLORS.primary : COLORS.textSecondary} 
            />
            <Text style={[styles.connectButtonText, bleConnection.isConnected && styles.connectedButtonText]}>
              {bleConnection.isConnected ? "연결됨" : "링 연결"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroSection}>
          <View style={styles.heroCard}>
            {!bleConnection.isConnected ? (
              <TouchableOpacity style={styles.connectPrompt} onPress={() => setModalVisible(true)}>
                <MaterialCommunityIcons name="ring" size={48} color={COLORS.primary} />
                <Text style={styles.connectPromptTitle}>스마트링을 연결해주세요</Text>
                <Text style={styles.connectPromptSub}>실시간 건강 데이터와 집중도 분석을 시작합니다</Text>
                <View style={styles.connectPromptButton}>
                  <Text style={styles.connectPromptButtonText}>연결하기</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <>
                <View style={styles.heroContent}>
                  <View>
                    <Text style={styles.heroLabel}>현재 집중도</Text>
                    <Text style={styles.heroValue}>{currentAlertness}%</Text>
                  </View>
                  <View style={styles.heroStatusBadge}>
                    <Text style={styles.heroStatusText}>최상</Text>
                  </View>
                </View>
                <View style={styles.heroChartContainer}>
                  <MiniChart
                    title="24시간 집중도 예측"
                    data={sleepForecast.map(f => ({ time: f.hour, value: f.alertness }))}
                    color={COLORS.primary}
                    height={80}
                  />
                </View>
              </>
            )}
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>실시간 건강 데이터</Text>
          
          <View style={styles.metricsGrid}>
            <MetricCard
              title="심박수"
              value={currentHealth?.heartRate || '--'}
              unit="bpm"
              status={currentHealth?.heartRate ? (currentHealth.heartRate > 100 ? '높음' : '정상') : '데이터 없음'}
              color={COLORS.heart}
              icon="heart-pulse"
            />
            <MetricCard
              title="혈중 산소"
              value={currentHealth?.oxygenLevel || '--'}
              unit="%"
              status={currentHealth?.oxygenLevel ? (currentHealth.oxygenLevel > 95 ? '정상' : '주의') : '데이터 없음'}
              color={COLORS.oxygen}
              icon="water"
            />
            <MetricCard
              title="활동량"
              value={currentHealth?.steps || 0}
              unit="걸음"
              status="진행 중"
              color={COLORS.steps}
              icon="run"
            />
            <MetricCard
              title="수면 효율"
              value={82}
              unit="%"
              status="회복 중"
              color={COLORS.sleep}
              icon="moon-waning-crescent"
            />
          </View>

          <Text style={styles.sectionTitle}>활동 트렌드</Text>
          <View style={styles.activityCard}>
             <MiniChart
                title="심박수 변화 (최근 24시간)"
                data={generateHeartRateData()}
                color={COLORS.heart}
                height={120}
              />
          </View>
        </View>
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Pairing Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>스마트링 연결</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.scanButton} onPress={scanDevices} disabled={bleConnection.isScanning}>
              {bleConnection.isScanning ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.scanButtonText}>주변 링 찾기</Text>
              )}
            </TouchableOpacity>

            {bleConnection.error && (
              <Text style={styles.errorText}>{bleConnection.error}</Text>
            )}

            <FlatList
              data={bleDevices}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.deviceItem} onPress={() => handleConnect(item.id)}>
                  <MaterialCommunityIcons name="ring" size={24} color={COLORS.primary} />
                  <View style={styles.deviceInfo}>
                    <Text style={styles.deviceName}>{item.name}</Text>
                    <Text style={styles.deviceId}>{item.id}</Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.border} />
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                !bleConnection.isScanning ? (
                  <Text style={styles.emptyText}>검색된 장치가 없습니다.</Text>
                ) : null
              }
              style={styles.deviceList}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function generateHeartRateData() {
  return Array.from({ length: 24 }, (_, i) => ({
    time: i,
    value: 60 + Math.sin(i / 4) * 20 + Math.random() * 10,
  }));
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
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  userName: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 4,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  connectedButton: {
    backgroundColor: COLORS.primaryLight,
  },
  connectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  connectedButtonText: {
    color: COLORS.primary,
  },
  heroSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  heroCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  heroLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  heroValue: {
    fontSize: 40,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 4,
  },
  heroStatusBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  heroStatusText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  heroChartContainer: {
    marginTop: 10,
  },
  connectPrompt: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  connectPromptTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 16,
  },
  connectPromptSub: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  connectPromptButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
  },
  connectPromptButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
    marginTop: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  activityCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bottomSpacer: {
    height: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  scanButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  deviceList: {
    maxHeight: 300,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 16,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  deviceId: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: COLORS.textTertiary,
  },
  errorText: {
    color: COLORS.heart,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
});
