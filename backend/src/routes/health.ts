import { Router } from 'express';
import {
  getActivityData,
  getCurrentHealth,
  getHealthAlerts,
  getHeartRateData,
  getMonthlyData,
  getStressData,
  getTodaySummary,
  getWeeklyData,
  saveActivityData,
  saveHealthData,
  saveHeartRateData,
  saveHeartRateDataBatch,
  saveStressData,
} from '../controllers/healthController';

const router = Router();

router.get('/current', getCurrentHealth);
router.post('/data', saveHealthData);
router.get('/heart-rate', getHeartRateData);
router.post('/heart-rate', saveHeartRateData);
router.post('/heart-rate/batch', saveHeartRateDataBatch);
router.get('/stress', getStressData);
router.post('/stress', saveStressData);
router.get('/activity', getActivityData);
router.post('/activity', saveActivityData);
router.get('/today-summary', getTodaySummary);
router.get('/weekly', getWeeklyData);
router.get('/monthly', getMonthlyData);
router.get('/alerts', getHealthAlerts);

export default router;
