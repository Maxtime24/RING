import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BLEConnectionState,
  BLEDevice,
  FocusAnalysis,
  HealthData,
  SleepData,
  User,
} from '../types';

const MAX_HISTORY_LENGTH = 2000; // Limit history to prevent excessive memory usage

interface AppStore {
  bleConnection: BLEConnectionState;
  bleDevices: BLEDevice[];
  currentHealth: HealthData | null;
  healthHistory: HealthData[];
  todaySleep: SleepData | null;
  focusAnalysis: FocusAnalysis | null;
  user: User | null;

  // Real-time measurement states
  isMeasuringHR: boolean;
  isMeasuringO2: boolean;
  lastHRMeasuredAt: string | null;
  lastO2MeasuredAt: string | null;
  
  setBleConnection: (state: Partial<BLEConnectionState>) => void;
  setBleDevices: (devices: BLEDevice[]) => void;
  setCurrentHealth: (health: HealthData | null) => void;
  setTodaySleep: (sleep: SleepData | null) => void;
  setFocusAnalysis: (focus: FocusAnalysis | null) => void;
  setUser: (user: User | null) => void;
  
  // Specific health updates
  setHeartRate: (bpm: number) => void;
  setOxygenLevel: (spo2: number) => void;
  setSteps: (steps: number) => void;

  // Real-time measurement actions
  setMeasuring: (type: 'hr' | 'o2', value: boolean) => void;
  setLastMeasuredAt: (type: 'hr' | 'o2', timestamp: string | null) => void;
}

const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      bleConnection: {
        isScanning: false,
        isConnecting: false,
        isConnected: false,
        device: null,
        error: null,
      },
      bleDevices: [],
      currentHealth: null,
      healthHistory: [],
      todaySleep: null,
      focusAnalysis: null,
      user: null,

      // Initial real-time measurement states
      isMeasuringHR: false,
      isMeasuringO2: false,
      lastHRMeasuredAt: null,
      lastO2MeasuredAt: null,

      setBleConnection: (state: Partial<BLEConnectionState>) =>
        set((current) => ({
          bleConnection: {
            ...current.bleConnection,
            ...state,
          },
        })),
      setBleDevices: (devices: BLEDevice[]) => set({ bleDevices: devices }),
      setCurrentHealth: (health: HealthData | null) => set({ currentHealth: health }),
      setTodaySleep: (todaySleep: SleepData | null) => set({ todaySleep }),
      setFocusAnalysis: (focusAnalysis: FocusAnalysis | null) => set({ focusAnalysis }),
      setUser: (user: User | null) => set({ user }),
      
      setHeartRate: (bpm: number) => set((state) => {
        const timestamp = new Date().toISOString();
        const newHealth = state.currentHealth 
          ? { ...state.currentHealth, heartRate: bpm, timestamp } 
          : { heartRate: bpm, oxygenLevel: 0, steps: 0, calories: 0, distance: 0, timestamp, id: timestamp, userId: 'local' } as any;
          
        const newHistory = [...state.healthHistory, newHealth].slice(-MAX_HISTORY_LENGTH);
        return { currentHealth: newHealth, healthHistory: newHistory };
      }),
      
      setOxygenLevel: (spo2: number) => set((state) => {
        const timestamp = new Date().toISOString();
        const newHealth = state.currentHealth 
          ? { ...state.currentHealth, oxygenLevel: spo2, timestamp } 
          : { heartRate: 0, oxygenLevel: spo2, steps: 0, calories: 0, distance: 0, timestamp, id: timestamp, userId: 'local' } as any;
          
        const newHistory = [...state.healthHistory, newHealth].slice(-MAX_HISTORY_LENGTH);
        return { currentHealth: newHealth, healthHistory: newHistory };
      }),
      
      setSteps: (steps: number) => set((state) => {
        const timestamp = new Date().toISOString();
        const newHealth = state.currentHealth 
          ? { ...state.currentHealth, steps: steps, timestamp } 
          : { heartRate: 0, oxygenLevel: 0, steps: steps, calories: 0, distance: 0, timestamp, id: timestamp, userId: 'local' } as any;
          
        const newHistory = [...state.healthHistory, newHealth].slice(-MAX_HISTORY_LENGTH);
        return { currentHealth: newHealth, healthHistory: newHistory };
      }),

      setMeasuring: (type: 'hr' | 'o2', value: boolean) => set((state) => {
        if (type === 'hr') {
          return { isMeasuringHR: value };
        } else {
          return { isMeasuringO2: value };
        }
      }),

      setLastMeasuredAt: (type: 'hr' | 'o2', timestamp: string | null) => set((state) => {
        if (type === 'hr') {
          return { lastHRMeasuredAt: timestamp };
        } else {
          return { lastO2MeasuredAt: timestamp };
        }
      }),
    }),
    {
      name: 'huck-storage', // unique name
      storage: createJSONStorage(() => AsyncStorage),
      // We don't want to persist BLE connection state, as it resets on app restart
      partialize: (state) => ({ 
        currentHealth: state.currentHealth,
        healthHistory: state.healthHistory,
        todaySleep: state.todaySleep,
        focusAnalysis: state.focusAnalysis,
        user: state.user,
        lastHRMeasuredAt: state.lastHRMeasuredAt,
        lastO2MeasuredAt: state.lastO2MeasuredAt,
      }),
    }
  )
);


export default useAppStore;
