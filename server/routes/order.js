import express from 'express';
import orderController from '../controllers/orderController.js';
import authMiddleware from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roles.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get orders with filtering and pagination
router.get('/', orderController.getAll);

// Get customers for autocomplete
router.get('/customers/autocomplete', orderController.getCustomersForAutocomplete);

// Get products for order items
router.get('/products', orderController.getProductsForOrder);

// Get order by ID
router.get('/:id', orderController.getById);

// Create new order (require admin)
router.post('/', requireAdmin, orderController.create);

// Update order (require admin)
router.put('/:id', requireAdmin, orderController.update);

// Delete order (require admin)
router.delete('/:id', requireAdmin, orderController.delete);

export default router;
