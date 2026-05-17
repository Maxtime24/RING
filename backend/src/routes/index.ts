import { Router } from 'express';
import healthRoutes from './health';
import sleepRoutes from './sleep';
import focusRoutes from './focus';

const router = Router();

router.use('/health', healthRoutes);
router.use('/sleep', sleepRoutes);
router.use('/focus', focusRoutes);

export default router;
