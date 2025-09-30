import { Router } from 'express';
import { getMetrics } from '../controllers/metricsController';
import { enforceTenantIsolation } from '../middleware/tenantIsolation';

const router = Router();

router.get('/', enforceTenantIsolation, getMetrics);

export default router;
