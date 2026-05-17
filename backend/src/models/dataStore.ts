export interface HealthData {
  id: string;
  userId: string;
  timestamp: string;
  heartRate: number;
  stressLevel: number;
  activityLevel: number;
  temperature: number;
  batteryLevel: number;
  skinContactState: boolean;
}

export interface HeartRateData {
  id: string;
  userId: string;
  timestamp: string;
  value: number;
}

export interface StressData {
  id: string;
  userId: string;
  timestamp: string;
  value: number;
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

export interface SleepData {
  id: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalDuration: number;
  quality: number;
  stages: Array<{ stage: string; startTime: string; endTime: string; duration: number }>;
  interruptionCount: number;
  deepSleepDuration: number;
  remSleepDuration: number;
  recoveryScore: number;
  notes?: string;
}

export interface FocusSession {
  id: string;
  userId: string;
  startTime: string;
  endTime: string;
  duration: number;
  focusScore: number;
  interruptionCount: number;
  productivityScore: number;
  notes?: string;
}

export const healthData: HealthData[] = [
  {
    id: 'health-001',
    userId: 'user-001',
    timestamp: new Date().toISOString(),
    heartRate: 72,
    stressLevel: 30,
    activityLevel: 65,
    temperature: 36.6,
    batteryLevel: 84,
    skinContactState: true,
  },
];

export const heartRateData: HeartRateData[] = Array.from({ length: 24 }, (_, index) => ({
  id: `hr-${index}`,
  userId: 'user-001',
  timestamp: new Date(Date.now() - (23 - index) * 60 * 60 * 1000).toISOString(),
  value: 60 + Math.round(Math.sin(index / 3) * 12 + Math.random() * 8),
}));

export const stressData: StressData[] = Array.from({ length: 14 }, (_, index) => ({
  id: `stress-${index}`,
  userId: 'user-001',
  timestamp: new Date(Date.now() - (13 - index) * 3 * 60 * 60 * 1000).toISOString(),
  value: 20 + Math.round(Math.random() * 60),
  category: index % 5 === 0 ? 'high' : 'normal',
}));

export const activityData: ActivityData[] = Array.from({ length: 14 }, (_, index) => ({
  id: `activity-${index}`,
  userId: 'user-001',
  timestamp: new Date(Date.now() - (13 - index) * 3 * 60 * 60 * 1000).toISOString(),
  steps: 4500 + Math.round(Math.random() * 7000),
  calories: 1800 + Math.round(Math.random() * 600),
  activeMinutes: 30 + Math.round(Math.random() * 80),
  restingHeartRate: 55 + Math.round(Math.random() * 10),
}));

export const sleepData: SleepData[] = [
  {
    id: 'sleep-001',
    userId: 'user-001',
    date: new Date().toISOString().slice(0, 10),
    startTime: '23:10',
    endTime: '06:40',
    totalDuration: 450,
    quality: 82,
    stages: [
      { stage: 'awake', startTime: '23:10', endTime: '23:20', duration: 10 },
      { stage: 'light', startTime: '23:20', endTime: '01:00', duration: 100 },
      { stage: 'deep', startTime: '01:00', endTime: '03:20', duration: 140 },
      { stage: 'rem', startTime: '03:20', endTime: '06:40', duration: 180 },
    ],
    interruptionCount: 1,
    deepSleepDuration: 140,
    remSleepDuration: 180,
    recoveryScore: 78,
    notes: 'Felt rested after waking up.',
  },
];

export const focusSessions: FocusSession[] = [
  {
    id: 'focus-001',
    userId: 'user-001',
    startTime: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    duration: 60,
    focusScore: 82,
    interruptionCount: 1,
    productivityScore: 88,
    notes: 'Completed deep work block before lunch.',
  },
];
