import { Request, Response } from 'express';
import { sleepData } from '../models/dataStore';

export function getTodaySleepData(_req: Request, res: Response) {
  const today = sleepData.find((item) => item.date === new Date().toISOString().slice(0, 10));
  return res.json({ success: true, data: today || null });
}

export function saveSleepData(req: Request, res: Response) {
  const payload = req.body;
  const newSleep = {
    id: `sleep-${Date.now()}`,
    userId: 'user-001',
    date: payload.date || new Date().toISOString().slice(0, 10),
    startTime: payload.startTime || '23:00',
    endTime: payload.endTime || '06:00',
    totalDuration: payload.totalDuration ?? 420,
    quality: payload.quality ?? 75,
    stages: payload.stages || [],
    interruptionCount: payload.interruptionCount ?? 1,
    deepSleepDuration: payload.deepSleepDuration ?? 120,
    remSleepDuration: payload.remSleepDuration ?? 140,
    recoveryScore: payload.recoveryScore ?? 80,
    notes: payload.notes ?? null,
  };

  sleepData.unshift(newSleep);
  return res.json({ success: true, data: newSleep });
}

export function getSleepDataByDate(req: Request, res: Response) {
  const { date } = req.params;
  const record = sleepData.find((item) => item.date === date);
  return res.json({ success: true, data: record || null });
}

export function getSleepDataRange(_req: Request, res: Response) {
  return res.json({
    success: true,
    data: {
      items: sleepData,
      total: sleepData.length,
      page: 1,
      pageSize: sleepData.length,
      hasMore: false,
    },
  });
}

export function getWeeklySleepData(_req: Request, res: Response) {
  const data = sleepData.slice(0, 7);
  const average = {
    duration:
      data.reduce((sum, record) => sum + record.totalDuration, 0) /
      Math.max(1, data.length),
    quality:
      data.reduce((sum, record) => sum + record.quality, 0) /
      Math.max(1, data.length),
    deepSleepDuration:
      data.reduce((sum, record) => sum + record.deepSleepDuration, 0) /
      Math.max(1, data.length),
    remSleepDuration:
      data.reduce((sum, record) => sum + record.remSleepDuration, 0) /
      Math.max(1, data.length),
  };

  return res.json({ success: true, data: { data, average } });
}

export function getMonthlySleepData(_req: Request, res: Response) {
  const trends = sleepData.slice(0, 30).map((record) => ({
    date: record.date,
    avgDuration: record.totalDuration,
    avgQuality: record.quality,
    deepSleepRatio: record.deepSleepDuration / Math.max(1, record.totalDuration),
  }));

  const average = {
    duration:
      sleepData.reduce((sum, record) => sum + record.totalDuration, 0) /
      Math.max(1, sleepData.length),
    quality:
      sleepData.reduce((sum, record) => sum + record.quality, 0) /
      Math.max(1, sleepData.length),
  };

  return res.json({ success: true, data: { data: sleepData, average, trends } });
}

export function analyzeSleepPattern(req: Request, res: Response) {
  const days = Number(req.query.days ?? 7);
  const sliced = sleepData.slice(0, days);

  const averageDuration =
    sliced.reduce((sum, record) => sum + record.totalDuration, 0) /
    Math.max(1, sliced.length);
  const averageQuality =
    sliced.reduce((sum, record) => sum + record.quality, 0) /
    Math.max(1, sliced.length);

  return res.json({
    success: true,
    data: {
      averageDuration,
      averageQuality,
      bestSleepTime: '23:00',
      worstSleepTime: '02:30',
      recommendations: ['Keep a regular bedtime', 'Reduce screen time before sleep'],
      trends: {
        improving: averageQuality > 75,
        changePercent: 5.2,
      },
    },
  });
}

export function getRecoveryScore(_req: Request, res: Response) {
  const today = sleepData[0];
  return res.json({
    success: true,
    data: {
      score: today?.recoveryScore ?? 0,
      level:
        today?.recoveryScore > 85
          ? 'excellent'
          : today?.recoveryScore > 70
          ? 'high'
          : today?.recoveryScore > 50
          ? 'medium'
          : 'low',
      message: '수면 회복 점수가 안정적입니다.',
    },
  });
}

let sleepGoal = {
  targetDurationMinutes: 480,
  currentStreak: 4,
  successRate: 78,
};

export function setSleepGoal(req: Request, res: Response) {
  const { targetDurationMinutes } = req.body;
  sleepGoal = {
    ...sleepGoal,
    targetDurationMinutes: Number(targetDurationMinutes) || sleepGoal.targetDurationMinutes,
  };

  return res.json({ success: true, data: sleepGoal });
}

export function getSleepGoal(_req: Request, res: Response) {
  return res.json({ success: true, data: sleepGoal });
}
