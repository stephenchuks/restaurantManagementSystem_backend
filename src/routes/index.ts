import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';

const router = Router();

// Mount the auth router under /auth
router.use('/auth', authRoutes);

export default router;
