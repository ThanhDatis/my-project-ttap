import express from 'express';
import productController from '../controllers/productController';
import authMiddleware from '../middleware/auth';
import { requireAdmin } from '../middleware/roles';

const router = express.Router();

router.use(authMiddleware);

router.get('/', productController.getAll);
router.get('/categories', productController.getCategories);
router.get('/:id', productController.getById);

router.post('/', requireAdmin, productController.create);
router.put('/:id', requireAdmin, productController.update);
router.delete('/:id', requireAdmin, productController.delete);

export default router;
