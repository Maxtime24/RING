/**
 * Smart Ring Healthcare App - Type Definitions
 * 모든 타입 정의를 한 곳에서 관리합니다.
 */

// ============================================================================
// USER & AUTHENTICATION
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  age?: number;
  gender?: 'M' | 'F' | 'OTHER';
  height?: number;
  weight?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

// ============================================================================
// BIOMETRIC DATA
// ============================================================================

export interface HealthData {
  id: string;
  userId: string;
  timestamp: string;
  heartRate: number; // bpm
  stressLevel: number; // 0-100
  activityLevel: number; // 0-100
  temperature: number; // Celsius
  batteryLevel: number; // 0-100
  skinContactState: boolean;
}

export interface HeartRateData {
  id: string;
  userId: string;
  timestamp: string;
  value: number; // bpm
  confidence?: number; // 0-100
}

export interface StressData {
  id: string;
  userId: string;
  timestamp: string;
  value: number; // estimated stress level 0-100
  category: 'low' | 'normal' | 'high' | 'critical';
}

export interface ActivityData {
  id: string;
  userId: string;
  timestamp: string;
  steps: number;
  calories: number;
  activeMinutes: number;
  restingHeartRate: number;
}

// ============================================================================
// SLEEP DATA
// ============================================================================

export interface SleepStage {
  stage: 'awake' | 'light' | 'deep' | 'rem';
  startTime: string;
  endTime: string;
  duration: number; // minutes
}

export interface SleepData {
  id: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalDuration: number; // minutes
  quality: number; // 0-100
  stages: SleepStage[];
  interruptionCount: number;
  deepSleepDuration: number; // minutes
  remSleepDuration: number; // minutes
  recoveryScore: number; // 0-100
  notes?: string;
}

export interface SleepTrend {
  date: string;
  avgDuration: number;
  avgQuality: number;
  deepSleepRatio: number;
}

// ============================================================================
// FOCUS & PRODUCTIVITY
// ============================================================================

export interface FocusSession {
  id: string;
  userId: string;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  focusScore: number; // 0-100
  interruptionCount: number;
  productivityScore: number; // 0-100
  notes?: string;
}

export interface FocusAnalysis {
  userId: string;
  date: string;
  peakHours: string[]; // ["09:00-11:00", "14:00-16:00"]
  avgFocusScore: number;
  totalFocusTime: number; // minutes
  recommendations: string[];
  fatigueLevel: number; // 0-100
  estimatedPeakTime: string; // "09:00-11:00"
}

export interface FocusPattern {
  hour: number;
  focusScore: number;
  activityLevel: number;
  stressLevel: number;
}

// ============================================================================
// SMART RING & BLE
// ============================================================================

export interface SmartRing {
  id: string;
  userId: string;
  macAddress: string;
  serialNumber: string;
  model: string;
  firmwareVersion: string;
  batteryLevel: number;
  isConnected: boolean;
  lastConnectedAt?: string;
  pairedAt: string;
}

export interface BLEDevice {
  id: string;
  name: string;
  macAddress: string;
  rssi: number;
  txPowerLevel?: number;
  isConnectable: boolean;
}

export interface BLEConnectionState {
  isScanning: boolean;
  isConnecting: boolean;
  isConnected: boolean;
  device: BLEDevice | null;
  error: string | null;
}

export interface BLECharacteristic {
  uuid: string;
  properties: {
    read: boolean;
    write: boolean;
    notify: boolean;
    indicate: boolean;
  };
  data?: string;
}

// ============================================================================
// API RESPONSES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================================================
// DASHBOARD
// ============================================================================

export interface DashboardData {
  currentHealth: HealthData;
  todaySleepData: SleepData | null;
  todayActivity: ActivityData | null;
  focusAnalysis: FocusAnalysis;
  alerts: HealthAlert[];
  recentData: {
    heartRate: HeartRateData[];
    stress: StressData[];
    activity: ActivityData[];
  };
}

export interface HealthAlert {
  id: string;
  userId: string;
  type: 'heart_rate' | 'stress' | 'sleep' | 'activity';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: string;
  isResolved: boolean;
}

// ============================================================================
// REPORTS
// ============================================================================

export interface HealthReport {
  id: string;
  userId: string;
  period: 'daily' | 'weekly' | 'monthly';
  date: string;
  summary: {
    avgHeartRate: number;
    avgStress: number;
    totalSleep: number;
    avgSleepQuality: number;
    totalActivity: number;
    avgFocusScore: number;
  };
  insights: string[];
  recommendations: string[];
}

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

export interface AppState {
  // Auth
  auth: AuthState;
  
  // UI
  isLoading: boolean;
  error: string | null;
  
  // Data
  currentHealth: HealthData | null;
  sleepData: SleepData[];
  focusData: FocusSession[];
  
  // BLE
  bleState: BLEConnectionState;
  smartRing: SmartRing | null;
}

// ============================================================================
// SETTINGS
// ============================================================================

export interface UserSettings {
  userId: string;
  theme: 'light' | 'dark' | 'auto';
  language: 'ko' | 'en' | 'ja';
  notifications: {
    enableNotifications: boolean;
    enableHealthAlerts: boolean;
    enableSleepReminder: boolean;
    enableActivityReminder: boolean;
    quietHoursStart: string; // "22:00"
    quietHoursEnd: string; // "08:00"
  };
  privacy: {
    shareWithDoctor: boolean;
    shareWithFamily: boolean;
    dataRetention: number; // days
  };
  healthGoals: {
    targetSleepDuration: number; // minutes
    targetActivityMinutes: number;
    targetStressLevel: number; // max stress level
  };
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  message?: string;
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export interface ErrorResponse {
  success: false;
  error: ApiError;
}

export type Result<T> = SuccessResponse<T> | ErrorResponse;

// ============================================================================
// DATE RANGE FILTER
// ============================================================================

export interface DateRange {
  startDate: string;
  endDate: string;
}

export type TimePeriod = 'today' | 'week' | 'month' | 'year' | 'custom';

// ============================================================================
// CHART DATA
// ============================================================================

export interface ChartDataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export interface TimeSeriesData {
  timestamps: string[];
  values: number[];
  labels?: string[];
}
