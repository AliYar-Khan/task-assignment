import { Router } from 'express';
import { getBranding, createOrUpdateBranding } from '../controllers/brandingController';
import { requireAuth } from '../middleware/auth';
import { enforceTenantIsolation } from '../middleware/tenantIsolation';

const router = Router();

router.post('/', requireAuth, enforceTenantIsolation, createOrUpdateBranding);
router.get('/', enforceTenantIsolation, getBranding);

export default router;
