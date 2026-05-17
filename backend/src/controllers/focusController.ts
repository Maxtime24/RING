import { Request, Response } from 'express';
import { focusSessions } from '../models/dataStore';

export function getFocusAnalysis(req: Request, res: Response) {
  const days = Number(req.query.days ?? 7);
  const sessions = focusSessions.slice(0, days);
  const avgFocusScore =
    sessions.reduce((sum, session) => sum + session.focusScore, 0) /
    Math.max(1, sessions.length);
  const totalFocusTime = sessions.reduce((sum, session) => sum + session.duration, 0);

  return res.json({
    success: true,
    data: {
      userId: 'user-001',
      date: new Date().toISOString().slice(0, 10),
      peakHours: ['09:00-11:00', '14:00-16:00'],
      avgFocusScore,
      totalFocusTime,
      recommendations: ['Take a short break every 90 minutes', 'Avoid distractions during peak focus windows'],
      fatigueLevel: 35,
      estimatedPeakTime: '09:00-11:00',
    },
  });
}

export function getFocusSessions(req: Request, res: Response) {
  const page = Number(req.query.page ?? 1);
  const pageSize = Number(req.query.pageSize ?? 20);
  const startIndex = (page - 1) * pageSize;
  const items = focusSessions.slice(startIndex, startIndex + pageSize);

  return res.json({
    success: true,
    data: {
      items,
      total: focusSessions.length,
      page,
      pageSize,
      hasMore: startIndex + pageSize < focusSessions.length,
    },
  });
}

export function saveFocusSession(req: Request, res: Response) {
  const payload = req.body;
  const newSession = {
    id: `focus-${Date.now()}`,
    userId: 'user-001',
    startTime: payload.startTime || new Date().toISOString(),
    endTime: payload.endTime || new Date().toISOString(),
    duration: payload.duration ?? 30,
    focusScore: payload.focusScore ?? 70,
    interruptionCount: payload.interruptionCount ?? 0,
    productivityScore: payload.productivityScore ?? 75,
    notes: payload.notes || null,
  };

  focusSessions.unshift(newSession);
  return res.json({ success: true, data: newSession });
}
