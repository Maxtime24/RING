import { Router } from 'express';
import { getFocusAnalysis, getFocusSessions, saveFocusSession } from '../controllers/focusController';

const router = Router();

router.get('/analysis', getFocusAnalysis);
router.get('/sessions', getFocusSessions);
router.post('/session', saveFocusSession);

export default router;
