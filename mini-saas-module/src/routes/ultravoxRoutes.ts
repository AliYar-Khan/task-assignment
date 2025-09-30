import { Router } from 'express';
import { makeTestCall } from '../controllers/ultravoxController';

const router = Router();

router.post('/test-call', makeTestCall);

export default router;
