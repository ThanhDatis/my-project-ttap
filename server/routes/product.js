/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const express = require('express');
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roles');

const router = express.Router();

router.use(authMiddleware);

router.get('/', productController.getAll);
router.get('/categories', productController.getCategories);
router.get('/:id', productController.getById);

router.post('/', requireAdmin, productController.create);
router.put('/:id', requireAdmin, productController.update);
router.delete('/:id', requireAdmin, productController.delete);

module.exports = router;
