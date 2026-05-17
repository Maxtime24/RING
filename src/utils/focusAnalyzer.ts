/**
 * Focus Analyzer
 * Calculates real-time focus scores based on heart rate data from BLE.
 *
 * Algorithm:
 * - High HR variability + moderate HR = focused cognitive state
 * - Very high HR = physical stress, low focus
 * - Very low HR = drowsy/sleeping, low focus
 * - Stable mid-range HR = calm focus
 */

export interface FocusPoint {
  timestamp: string;
  focusScore: number;   // 0-100
  heartRate: number;
  hrvApprox: number;    // Approximate HRV (inter-beat variation)
}

export interface FocusPattern {
  time: string;
  level: '높음' | '보통' | '낮음';
  percentage: number;
  color: string;
}

const FOCUS_COLORS = {
  high: '#4CAF50',
  medium: '#FF9800',
  low: '#F44336',
};

/**
 * Calculate a focus score from a window of HR data.
 * @param hrWindow Array of recent heart rate values
 * @returns Focus score 0-100
 */
export function calculateFocusScore(hrWindow: number[]): number {
  if (hrWindow.length === 0) return 0;

  const avg = hrWindow.reduce((a, b) => a + b, 0) / hrWindow.length;

  // Approximate HRV as standard deviation of HR values
  const variance =
    hrWindow.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / hrWindow.length;
  const stdDev = Math.sqrt(variance);

  // Ideal HR range for cognitive focus: 55-85 bpm
  // Score decreases outside this range
  let hrScore = 0;
  if (avg >= 55 && avg <= 85) {
    hrScore = 100 - Math.abs(avg - 70) * 2; // peak at 70 bpm
  } else if (avg < 55) {
    hrScore = Math.max(0, avg - 40) * (100 / 15); // drowsy
  } else {
    hrScore = Math.max(0, 100 - (avg - 85) * 3); // stressed
  }

  // HRV contribution: some variability (stdDev 2-8) is good for focus
  let hrvScore = 0;
  if (stdDev >= 2 && stdDev <= 8) {
    hrvScore = 100;
  } else if (stdDev < 2) {
    hrvScore = stdDev * 50; // too rigid
  } else {
    hrvScore = Math.max(0, 100 - (stdDev - 8) * 10); // too chaotic
  }

  // Weighted combination
  const focusScore = hrScore * 0.6 + hrvScore * 0.4;
  return Math.round(Math.max(0, Math.min(100, focusScore)));
}

/**
 * Process healthHistory records into time-series focus data for charts.
 */
export function buildFocusChartData(
  healthHistory: any[],
  windowSize: number = 5
): { time: string; value: number; id: string }[] {
  const hrRecords = healthHistory.filter((d) => d.heartRate > 0);
  if (hrRecords.length === 0) return [];

  const result: { time: string; value: number; id: string }[] = [];

  for (let i = 0; i < hrRecords.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const window = hrRecords.slice(start, i + 1).map((d) => d.heartRate);
    const score = calculateFocusScore(window);

    const date = new Date(hrRecords[i].timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const mins = date.getMinutes().toString().padStart(2, '0');

    result.push({
      time: `${hours}:${mins}`,
      value: score,
      id: hrRecords[i].timestamp,
    });
  }

  return result;
}

/**
 * Compute today's peak focus patterns grouped by hour block.
 */
export function buildFocusPatterns(
  healthHistory: any[],
  windowSize: number = 5
): FocusPattern[] {
  const hrRecords = healthHistory.filter((d) => d.heartRate > 0);
  if (hrRecords.length < 2) return [];

  // Group by hour
  const byHour: Record<number, number[]> = {};
  for (const record of hrRecords) {
    const hour = new Date(record.timestamp).getHours();
    if (!byHour[hour]) byHour[hour] = [];
    byHour[hour].push(record.heartRate);
  }

  const hours = Object.keys(byHour).map(Number).sort((a, b) => a - b);
  if (hours.length === 0) return [];

  // Merge consecutive hours into blocks
  const blocks: { startHour: number; endHour: number; scores: number[] }[] = [];
  let currentBlock = { startHour: hours[0], endHour: hours[0], scores: [...byHour[hours[0]]] };

  for (let i = 1; i < hours.length; i++) {
    if (hours[i] - currentBlock.endHour <= 2) {
      currentBlock.endHour = hours[i];
      currentBlock.scores.push(...byHour[hours[i]]);
    } else {
      blocks.push({ ...currentBlock });
      currentBlock = { startHour: hours[i], endHour: hours[i], scores: [...byHour[hours[i]]] };
    }
  }
  blocks.push(currentBlock);

  return blocks.slice(0, 4).map((block) => {
    const score = calculateFocusScore(block.scores);
    const level: FocusPattern['level'] = score >= 70 ? '높음' : score >= 40 ? '보통' : '낮음';
    const color = score >= 70 ? FOCUS_COLORS.high : score >= 40 ? FOCUS_COLORS.medium : FOCUS_COLORS.low;
    const start = `${block.startHour.toString().padStart(2, '0')}:00`;
    const end = `${(block.endHour + 1).toString().padStart(2, '0')}:00`;
    return { time: `${start} - ${end}`, level, percentage: score, color };
  });
}

/**
 * Compute the current focus score from the last N HR samples.
 */
export function getCurrentFocusScore(healthHistory: any[], lastN = 10): number {
  const hrRecords = healthHistory.filter((d) => d.heartRate > 0).slice(-lastN);
  return calculateFocusScore(hrRecords.map((d) => d.heartRate));
}
