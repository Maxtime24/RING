import { Router } from 'express';
import {
  analyzeSleepPattern,
  getMonthlySleepData,
  getRecoveryScore,
  getSleepDataByDate,
  getSleepDataRange,
  getSleepGoal,
  getWeeklySleepData,
  saveSleepData,
  setSleepGoal,
  getTodaySleepData,
} from '../controllers/sleepController';

const router = Router();

router.get('/today', getTodaySleepData);
router.post('/data', saveSleepData);
router.get('/data/:date', getSleepDataByDate);
router.get('/range', getSleepDataRange);
router.get('/weekly', getWeeklySleepData);
router.get('/monthly', getMonthlySleepData);
router.get('/analysis', analyzeSleepPattern);
router.get('/recovery-score', getRecoveryScore);
router.post('/goal', setSleepGoal);
router.get('/goal', getSleepGoal);

export default router;
