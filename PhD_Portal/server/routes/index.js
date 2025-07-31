import express from 'express';
import registerRoute from './registerRoute.js';
import uploadRoute from './uploadRoute.js';
import authRoutes from './auth.js';

const router = express.Router();

router.use('/register', registerRoute);
router.use('/upload', uploadRoute);
router.use('/auth', authRoutes);

export default router;
