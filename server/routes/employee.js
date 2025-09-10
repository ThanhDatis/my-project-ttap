import express from 'express';
import employeeController from '../controllers/employeeController.js';
import authMiddleware from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roles.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', employeeController.getAll);
router.get('/:id', employeeController.getById);

router.post('/', requireAdmin, employeeController.create);
router.put('/:id', requireAdmin, employeeController.update);
router.delete('/:id', requireAdmin, employeeController.delete);

export default router;
