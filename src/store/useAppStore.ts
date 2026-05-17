import { create } from 'zustand';
import {
  BLEConnectionState,
  BLEDevice,
  FocusAnalysis,
  HealthData,
  SleepData,
  User,
} from '../types';

interface AppStore {
  bleConnection: BLEConnectionState;
  bleDevices: BLEDevice[];
  currentHealth: HealthData | null;
  todaySleep: SleepData | null;
  focusAnalysis: FocusAnalysis | null;
  user: User | null;
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
}

const useAppStore = create<AppStore>((set) => ({
  bleConnection: {
    isScanning: false,
    isConnecting: false,
    isConnected: false,
    device: null,
    error: null,
  },
  bleDevices: [],
  currentHealth: null,
  todaySleep: null,
  focusAnalysis: null,
  user: null,

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
  
  setHeartRate: (bpm: number) => set((state) => ({
    currentHealth: state.currentHealth 
      ? { ...state.currentHealth, heartRate: bpm } 
      : { heartRate: bpm, oxygenLevel: 0, steps: 0, calories: 0, distance: 0, timestamp: new Date().toISOString() } as any
  })),
  setOxygenLevel: (spo2: number) => set((state) => ({
    currentHealth: state.currentHealth 
      ? { ...state.currentHealth, oxygenLevel: spo2 } 
      : { heartRate: 0, oxygenLevel: spo2, steps: 0, calories: 0, distance: 0, timestamp: new Date().toISOString() } as any
  })),
  setSteps: (steps: number) => set((state) => ({
    currentHealth: state.currentHealth 
      ? { ...state.currentHealth, steps: steps } 
      : { heartRate: 0, oxygenLevel: 0, steps: steps, calories: 0, distance: 0, timestamp: new Date().toISOString() } as any
  })),
}));

export default useAppStore;
