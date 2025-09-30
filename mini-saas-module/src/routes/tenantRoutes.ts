import { Router } from 'express';
import { createTenant, getTenantBySubdomain, listTenants } from '../controllers/tenantController';
import { enforceTenantIsolation } from '../middleware/tenantIsolation';

const router = Router();

router.use(enforceTenantIsolation);
router.post('/', createTenant);
router.get('/:subdomain', getTenantBySubdomain);
router.get('/', listTenants);

export default router;
