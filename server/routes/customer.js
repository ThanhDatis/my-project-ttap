import express from 'express';
import customerController from '../controllers/customerController.js';
import authMiddleware from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roles.js';

const router = express.Router();

// Apply auth middleware to all routes in this router
router.use(authMiddleware);

router.get('/', customerController.getAll);
router.get('/:id', customerController.getById);

router.post('/', requireAdmin, customerController.create);
router.put('/:id', requireAdmin, customerController.update);
router.delete('/:id', requireAdmin, customerController.delete);

export default router;
