/**
 * 상수 정의
 */

// API 설정
// 에뮬레이터: http://10.0.2.2:3000/api
// 실기기: http://[내 컴퓨터 IP]:3000/api
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
export const API_TIMEOUT = 15000; // 15 seconds

// BLE 설정
export const BLE_SMART_RING_NAME = 'SmartRing';
export const BLE_SCAN_TIMEOUT = 30000; // 30 seconds
export const BLE_RECONNECT_INTERVAL = 5000; // 5 seconds
export const BLE_MAX_RECONNECT_ATTEMPTS = 3;

// Service UUIDs (R02 / Colmi Smart Ring)
export const BLE_SERVICE_UUIDS = {
  UART: '6E40FFF0-B5A3-F393-E0A9-E50E24DCCA9E',
  HEALTH: '180D',
  DEVICE_INFO: '180A',
  BATTERY: '180F',
};

// Characteristic UUIDs
export const BLE_CHARACTERISTIC_UUIDS = {
  UART_RX: '6E400002-B5A3-F393-E0A9-E50E24DCCA9E', // Write
  UART_TX: '6E400003-B5A3-F393-E0A9-E50E24DCCA9E', // Notify
  HEART_RATE: '2A37',
  BATTERY_LEVEL: '2A19',
};

// 시간대별 집중력 분석
export const FOCUS_TIME_SLOTS = [
  '06:00-08:00',
  '08:00-10:00',
  '10:00-12:00',
  '12:00-14:00',
  '14:00-16:00',
  '16:00-18:00',
  '18:00-20:00',
  '20:00-22:00',
  '22:00-00:00',
  '00:00-06:00',
];

// 수면 단계
export const SLEEP_STAGES = {
  AWAKE: 'awake',
  LIGHT: 'light',
  DEEP: 'deep',
  REM: 'rem',
} as const;

export const SLEEP_STAGE_LABELS = {
  awake: '깨어있음',
  light: '얕은 수면',
  deep: '깊은 수면',
  rem: 'REM 수면',
};

export const SLEEP_STAGE_COLORS = {
  awake: '#FF6B6B',
  light: '#FFD93D',
  deep: '#6BCB77',
  rem: '#4D96FF',
};

// 스트레스 레벨
export const STRESS_LEVELS = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export const STRESS_LEVEL_RANGES = {
  low: { min: 0, max: 30 },
  normal: { min: 31, max: 60 },
  high: { min: 61, max: 85 },
  critical: { min: 86, max: 100 },
};

export const STRESS_LEVEL_COLORS = {
  low: '#10B981', // green
  normal: '#3B82F6', // blue
  high: '#F59E0B', // amber
  critical: '#EF4444', // red
};

export const STRESS_LEVEL_LABELS = {
  low: '낮음',
  normal: '정상',
  high: '높음',
  critical: '매우 높음',
};

// 활동 레벨
export const ACTIVITY_LEVELS = {
  SEDENTARY: 'sedentary',
  LIGHT: 'light',
  MODERATE: 'moderate',
  VIGOROUS: 'vigorous',
} as const;

export const ACTIVITY_LEVEL_COLORS = {
  sedentary: '#9CA3AF',
  light: '#FBBF24',
  moderate: '#34D399',
  vigorous: '#F97316',
};

// 심박수 범위 (연령 기반)
export const HEART_RATE_ZONES = {
  AT_REST: { min: 0, max: 60, label: '안정' },
  EASY_RECOVERY: { min: 61, max: 80, label: '휴식' },
  AEROBIC: { min: 81, max: 120, label: '유산소' },
  THRESHOLD: { min: 121, max: 160, label: '임계값' },
  MAXIMUM: { min: 161, max: 220, label: '최대' },
};

export const HEART_RATE_ZONE_COLORS = {
  AT_REST: '#10B981',
  EASY_RECOVERY: '#3B82F6',
  AEROBIC: '#F59E0B',
  THRESHOLD: '#EF4444',
  MAXIMUM: '#7C3AED',
};

// UI 테마 - 토스(Toss) 스타일 (화이트/블루/그레이)
export const COLORS = {
  // Primary
  primary: '#3182F6', // Toss Blue
  primaryLight: '#E8F3FF', // Light Blue
  primaryDark: '#1B64DA',
  
  // Neutral
  background: '#FFFFFF',
  backgroundSecondary: '#F2F4F6', // Light Gray background
  card: '#FFFFFF',
  
  // Text
  text: '#191F28', // Dark Gray
  textSecondary: '#4E5968', // Medium Gray
  textTertiary: '#8B95A1', // Light Gray
  
  // Status
  success: '#00D5EA',
  warning: '#FFBB00',
  error: '#FF4D4D',
  
  // Border
  border: '#E5E8EB',
  
  // Specific Health Colors (Keep these but match style)
  heart: '#FF4D4D',
  oxygen: '#3182F6',
  focus: '#6255FF',
  sleep: '#5061FF',
  steps: '#00D5EA',
};

// 다크 모드 (필요시)
export const DARK_COLORS = {
  background: '#191F28',
  backgroundSecondary: '#2C3542',
  text: '#FFFFFF',
  textSecondary: '#B0B8C1',
  border: '#333D4B',
};

// 타이포그래피 - 토스 스타일 (Inter/Sans-serif)
export const TYPOGRAPHY = {
  h1: { size: 26, weight: '700' as const },
  h2: { size: 22, weight: '700' as const },
  h3: { size: 18, weight: '600' as const },
  body: { size: 15, weight: '400' as const },
  caption: { size: 13, weight: '400' as const },
};

// 숫자 포맷
export const NUMBER_FORMATS = {
  HEART_RATE: 'bpm',
  STRESS: '%',
  SLEEP: 'h',
  ACTIVITY: 'cal',
  STEPS: 'steps',
  TEMPERATURE: '°C',
};

// 데이터 수집 간격 (밀리초)
export const DATA_COLLECTION_INTERVAL = {
  HEART_RATE: 60000, // 1 minute
  STRESS: 300000, // 5 minutes
  ACTIVITY: 900000, // 15 minutes
  SLEEP: 1800000, // 30 minutes
};

// 에러 코드
export const ERROR_CODES = {
  // Auth
  AUTH_INVALID_CREDENTIALS: 'AUTH_001',
  AUTH_TOKEN_EXPIRED: 'AUTH_002',
  AUTH_UNAUTHORIZED: 'AUTH_003',
  
  // BLE
  BLE_NOT_AVAILABLE: 'BLE_001',
  BLE_SCAN_FAILED: 'BLE_002',
  BLE_CONNECTION_FAILED: 'BLE_003',
  BLE_DEVICE_NOT_FOUND: 'BLE_004',
  
  // API
  API_REQUEST_FAILED: 'API_001',
  API_TIMEOUT: 'API_002',
  API_VALIDATION_ERROR: 'API_003',
  
  // Health Data
  HEALTH_DATA_INVALID: 'HEALTH_001',
  HEALTH_DATA_SYNC_FAILED: 'HEALTH_002',
  
  // General
  UNKNOWN_ERROR: 'GENERAL_001',
  NETWORK_ERROR: 'NETWORK_001',
};

// 에러 메시지
export const ERROR_MESSAGES = {
  AUTH_INVALID_CREDENTIALS: '이메일 또는 비밀번호가 올바르지 않습니다',
  AUTH_TOKEN_EXPIRED: '세션이 만료되었습니다. 다시 로그인해주세요',
  AUTH_UNAUTHORIZED: '접근 권한이 없습니다',
  
  BLE_NOT_AVAILABLE: 'Bluetooth가 사용 불가능합니다',
  BLE_SCAN_FAILED: 'BLE 스캔에 실패했습니다',
  BLE_CONNECTION_FAILED: '스마트링 연결에 실패했습니다',
  BLE_DEVICE_NOT_FOUND: '근처에서 스마트링을 찾을 수 없습니다',
  
  API_REQUEST_FAILED: '요청 처리에 실패했습니다',
  API_TIMEOUT: '요청 시간이 초과되었습니다',
  API_VALIDATION_ERROR: '입력 값이 올바르지 않습니다',
  
  HEALTH_DATA_INVALID: '건강 데이터가 유효하지 않습니다',
  HEALTH_DATA_SYNC_FAILED: '데이터 동기화에 실패했습니다',
  
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다',
  NETWORK_ERROR: '네트워크 연결을 확인해주세요',
};

// 시간 형식
export const TIME_FORMATS = {
  TIME_12H: 'h:mm A',
  TIME_24H: 'HH:mm',
  DATE: 'YYYY-MM-DD',
  DATE_TIME: 'YYYY-MM-DD HH:mm',
  MONTH_DAY: 'MM-DD',
};

// 언어
export const LANGUAGES = {
  KO: 'ko',
  EN: 'en',
  JA: 'ja',
} as const;

// 페이지 크기
export const PAGE_SIZE = 20;

// 재시도 정책
export const RETRY_POLICY = {
  MAX_ATTEMPTS: 3,
  INITIAL_DELAY: 1000, // 1 second
  MAX_DELAY: 10000, // 10 seconds
  BACKOFF_MULTIPLIER: 2,
};
