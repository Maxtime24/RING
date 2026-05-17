/**
 * Sleep Analyzer
 * Estimates sleep stages and quality from overnight heart rate data stored in healthHistory.
 *
 * Algorithm:
 * - Detect "sleep window" = consecutive records where HR stays below restingThreshold
 * - Classify HR ranges into sleep stages (Deep < 55, REM 55-65, Light 65-75, Awake > 75)
 * - Compute duration, quality score, and stage breakdown
 */

export interface SleepStageData {
  stage: 'awake' | 'light' | 'deep' | 'rem';
  startTime: string;
  endTime: string;
  duration: number; // minutes
}

export interface AnalyzedSleepData {
  totalDuration: number;     // minutes
  quality: number;           // 0-100
  stages: SleepStageData[];
  deepSleepDuration: number; // minutes
  remSleepDuration: number;  // minutes
  interruptionCount: number;
  recoveryScore: number;     // 0-100
  startTime: string;
  endTime: string;
  hasSleepData: boolean;
}

const HR_THRESHOLDS = {
  deep:  55,   // HR < 55 bpm → deep sleep
  rem:   65,   // HR 55-65 → REM
  light: 75,   // HR 65-75 → light sleep
  // > 75 → awake / restless
};

function classifyStage(hr: number): 'awake' | 'light' | 'deep' | 'rem' {
  if (hr < HR_THRESHOLDS.deep) return 'deep';
  if (hr < HR_THRESHOLDS.rem) return 'rem';
  if (hr < HR_THRESHOLDS.light) return 'light';
  return 'awake';
}

/**
 * Detect the sleep window from the last 24h of healthHistory.
 * Returns records that fall within the presumed sleep period (10 PM – 9 AM).
 */
function extractSleepRecords(healthHistory: any[]): any[] {
  return healthHistory.filter((d) => {
    if (!d.heartRate || d.heartRate <= 0) return false;
    const hour = new Date(d.timestamp).getHours();
    // Possible sleep hours: 21:00 – 09:00
    return hour >= 21 || hour <= 9;
  });
}

/**
 * Analyze healthHistory and produce a SleepData-compatible object.
 */
export function analyzeSleep(healthHistory: any[]): AnalyzedSleepData {
  const sleepRecords = extractSleepRecords(healthHistory);

  const empty: AnalyzedSleepData = {
    totalDuration: 0,
    quality: 0,
    stages: [],
    deepSleepDuration: 0,
    remSleepDuration: 0,
    interruptionCount: 0,
    recoveryScore: 0,
    startTime: '',
    endTime: '',
    hasSleepData: false,
  };

  if (sleepRecords.length < 3) return empty;

  const sorted = [...sleepRecords].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const startTime = sorted[0].timestamp;
  const endTime = sorted[sorted.length - 1].timestamp;
  const totalMs = new Date(endTime).getTime() - new Date(startTime).getTime();
  const totalDuration = Math.round(totalMs / 60000);

  if (totalDuration < 10) return empty;

  // Build stage segments
  const stages: SleepStageData[] = [];
  let currentStage = classifyStage(sorted[0].heartRate);
  let segStart = sorted[0].timestamp;
  let interruptionCount = 0;

  for (let i = 1; i < sorted.length; i++) {
    const newStage = classifyStage(sorted[i].heartRate);
    if (newStage !== currentStage) {
      const segEnd = sorted[i].timestamp;
      const dur = Math.round(
        (new Date(segEnd).getTime() - new Date(segStart).getTime()) / 60000
      );
      if (dur > 0) {
        stages.push({ stage: currentStage, startTime: segStart, endTime: segEnd, duration: dur });
        if (newStage === 'awake' && currentStage !== 'awake') interruptionCount++;
      }
      currentStage = newStage;
      segStart = sorted[i].timestamp;
    }
  }
  // Last segment
  const lastDur = Math.round(
    (new Date(endTime).getTime() - new Date(segStart).getTime()) / 60000
  );
  if (lastDur > 0) stages.push({ stage: currentStage, startTime: segStart, endTime, duration: lastDur });

  const deepSleepDuration = stages.filter((s) => s.stage === 'deep').reduce((acc, s) => acc + s.duration, 0);
  const remSleepDuration = stages.filter((s) => s.stage === 'rem').reduce((acc, s) => acc + s.duration, 0);

  // Quality: weighted score
  const deepRatio = deepSleepDuration / Math.max(totalDuration, 1);
  const remRatio = remSleepDuration / Math.max(totalDuration, 1);
  const durationScore = Math.min(100, (totalDuration / 480) * 100); // 8 hrs = 100
  const quality = Math.round(
    durationScore * 0.4 + deepRatio * 200 * 0.35 + remRatio * 150 * 0.25
  );

  const recoveryScore = Math.min(100, Math.round(quality * 0.8 + deepRatio * 100 * 0.2));

  return {
    totalDuration,
    quality: Math.min(100, quality),
    stages,
    deepSleepDuration,
    remSleepDuration,
    interruptionCount,
    recoveryScore,
    startTime,
    endTime,
    hasSleepData: true,
  };
}

/**
 * Format minutes into "X시간 Y분" string.
 */
export function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}분`;
  if (m === 0) return `${h}시간`;
  return `${h}시간 ${m}분`;
}

/**
 * Build weekly sleep chart data (daily totals) from healthHistory.
 */
export function buildWeeklySleepChartData(healthHistory: any[]): { time: string; value: number; id: string }[] {
  const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];
  const byDay: Record<string, number[]> = {};

  for (const record of healthHistory) {
    if (!record.heartRate || record.heartRate <= 0) continue;
    const hour = new Date(record.timestamp).getHours();
    if (hour < 21 && hour > 9) continue; // not a sleep hour
    const dateKey = new Date(record.timestamp).toLocaleDateString('ko-KR');
    if (!byDay[dateKey]) byDay[dateKey] = [];
    byDay[dateKey].push(record.heartRate);
  }

  const days = Object.keys(byDay).sort().slice(-7);
  if (days.length === 0) return [];

  return days.map((dateKey, i) => {
    // Approximate sleep duration: count of records * avg interval (assume 1 min/record)
    const records = byDay[dateKey].length;
    const approxHours = Math.min(12, records / 60); // cap at 12 hrs
    const date = new Date(dateKey);
    return {
      time: DAY_LABELS[date.getDay()],
      value: parseFloat(approxHours.toFixed(1)),
      id: `sleep-day-${i}`,
    };
  });
}
