import { Request, Response } from 'express';
import {
  activityData,
  heartRateData,
  healthData,
  stressData,
} from '../models/dataStore';

export function getCurrentHealth(_req: Request, res: Response) {
  const current = healthData[0];
  return res.json({ success: true, data: current });
}

export function saveHealthData(req: Request, res: Response) {
  const payload = req.body;
  const newData = {
    id: `health-${Date.now()}`,
    userId: 'user-001',
    timestamp: new Date().toISOString(),
    heartRate: payload.heartRate ?? 0,
    stressLevel: payload.stressLevel ?? 0,
    activityLevel: payload.activityLevel ?? 0,
    temperature: payload.temperature ?? 36.5,
    batteryLevel: payload.batteryLevel ?? 100,
    skinContactState: payload.skinContactState ?? true,
  };

  healthData.unshift(newData);
  return res.json({ success: true, data: newData });
}

export function getHeartRateData(req: Request, res: Response) {
  const { page = '1', pageSize = '20' } = req.query;
  const pageNumber = Number(page);
  const limit = Number(pageSize);
  const items = heartRateData.slice(0, limit);

  return res.json({
    success: true,
    data: {
      items,
      total: heartRateData.length,
      page: pageNumber,
      pageSize: limit,
      hasMore: limit < heartRateData.length,
    },
  });
}

export function saveHeartRateData(req: Request, res: Response) {
  const payload = req.body;
  const entry = {
    id: `hr-${Date.now()}`,
    userId: 'user-001',
    timestamp: new Date().toISOString(),
    value: payload.value ?? 0,
  };

  heartRateData.unshift(entry);
  return res.json({ success: true, data: entry });
}

export function saveHeartRateDataBatch(req: Request, res: Response) {
  const data = Array.isArray(req.body.data) ? req.body.data : [];
  const saved = data.map((payload: any) => ({
    id: `hr-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    userId: 'user-001',
    timestamp: payload.timestamp || new Date().toISOString(),
    value: payload.value ?? 0,
  }));

  heartRateData.unshift(...saved);
  return res.json({ success: true, data: { saved: saved.length, failed: 0 } });
}

export function getStressData(req: Request, res: Response) {
  const items = stressData.slice(0, 20);
  return res.json({
    success: true,
    data: {
      items,
      total: stressData.length,
      page: 1,
      pageSize: items.length,
      hasMore: items.length < stressData.length,
    },
  });
}

export function saveStressData(req: Request, res: Response) {
  const payload = req.body;
  const entry = {
    id: `stress-${Date.now()}`,
    userId: 'user-001',
    timestamp: new Date().toISOString(),
    value: payload.value ?? 0,
    category: payload.category ?? 'normal',
  };

  stressData.unshift(entry);
  return res.json({ success: true, data: entry });
}

export function getActivityData(req: Request, res: Response) {
  const items = activityData.slice(0, 20);
  return res.json({
    success: true,
    data: {
      items,
      total: activityData.length,
      page: 1,
      pageSize: items.length,
      hasMore: items.length < activityData.length,
    },
  });
}

export function saveActivityData(req: Request, res: Response) {
  const payload = req.body;
  const entry = {
    id: `activity-${Date.now()}`,
    userId: 'user-001',
    timestamp: new Date().toISOString(),
    steps: payload.steps ?? 0,
    calories: payload.calories ?? 0,
    activeMinutes: payload.activeMinutes ?? 0,
    restingHeartRate: payload.restingHeartRate ?? 60,
  };

  activityData.unshift(entry);
  return res.json({ success: true, data: entry });
}

export function getTodaySummary(_req: Request, res: Response) {
  const latestHealth = healthData[0];
  const activity = activityData[0];

  return res.json({
    success: true,
    data: {
      heartRate: {
        min: Math.min(...heartRateData.map((item) => item.value)),
        max: Math.max(...heartRateData.map((item) => item.value)),
        avg:
          heartRateData.reduce((sum, item) => sum + item.value, 0) /
          Math.max(1, heartRateData.length),
      },
      stress: {
        min: Math.min(...stressData.map((item) => item.value)),
        max: Math.max(...stressData.map((item) => item.value)),
        avg:
          stressData.reduce((sum, item) => sum + item.value, 0) /
          Math.max(1, stressData.length),
      },
      activity: {
        steps: activity?.steps ?? 0,
        calories: activity?.calories ?? 0,
        activeMinutes: activity?.activeMinutes ?? 0,
      },
      latestHealth,
    },
  });
}

export function getWeeklyData(_req: Request, res: Response) {
  return res.json({
    success: true,
    data: {
      heartRate: heartRateData.slice(0, 7).map((item) => item.value),
      stress: stressData.slice(0, 7).map((item) => item.value),
      activity: activityData.slice(0, 7).map((item) => item.steps),
      dates: activityData.slice(0, 7).map((item) => item.timestamp.slice(0, 10)),
    },
  });
}

export function getMonthlyData(_req: Request, res: Response) {
  return res.json({
    success: true,
    data: {
      heartRate: heartRateData.map((item) => item.value),
      stress: stressData.map((item) => item.value),
      activity: activityData.map((item) => item.steps),
      dates: activityData.map((item) => item.timestamp.slice(0, 10)),
    },
  });
}

export function getHealthAlerts(_req: Request, res: Response) {
  const alerts = [];
  if (healthData[0]?.heartRate > 120) {
    alerts.push({
      id: 'alert-1',
      title: 'High heart rate detected',
      severity: 'warning',
    });
  }

  return res.json({ success: true, data: alerts });
}
