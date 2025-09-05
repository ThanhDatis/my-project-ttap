import express from 'express';
import authController from '../controllers/authController';
import authMiddleware from '../middleware/auth';

const router = express.Router();

router.post('/signin', authController.signin);
router.post('/signup', authController.signup);
router.get('/profile', authMiddleware, authController.getProfile);

export default router;
