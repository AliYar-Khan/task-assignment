import { Router } from 'express';
import { updateBranding, getBranding, createBranding } from '../controllers/brandingController';
import { requireAuth } from '../middleware/auth';
import { enforceTenantIsolation } from '../middleware/tenantIsolation';

const router = Router();

router.post('/', requireAuth, enforceTenantIsolation, createBranding);
router.get('/', enforceTenantIsolation, getBranding);
router.patch('/', requireAuth, enforceTenantIsolation, updateBranding);

export default router;
