import { Router } from 'express';
import { signup, login } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);

router.get('/me', requireAuth, (req, res) => {
	const user = (req as any).user;
	res.json({
		userId: user.userId,
		tenantId: user.tenantId,
		role: user.role
	});
});

export default router;
