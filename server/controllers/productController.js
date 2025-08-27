/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
const { parse } = require('path');
const Product = require('../models/product');

const productController = {
  getAll: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        category,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      let query = { isActive: true };

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { sku: { $regex: search, $options: 'i' } },
          // { description: { $regex: search, $options: 'i' } }
        ];
      }

      if (category && category !== 'all') {
        query.category = category;
      }

      const sort = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      const products = await Product.find(query)
        .populate('createdBy', 'name email')
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Product.countDocuments(query);

      res.json({
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id).populate('category', 'name');

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.json(product);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  create: async (req, res) => {
    try {
      const productData = {
        ...req.body,
        createdBy: req.user._id
      };

      const newProduct = await Product.create(productData);
      await newProduct.populate('createdBy', 'name email');

      res.status(201).json({
        message: 'Product created successfully',
        product: newProduct
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  update: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      res.json({
        message: 'Product updated successfully',
        product: updatedProduct
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  delete: async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
      );

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.json({
        message: 'Product deleted successfully',
        product
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  getCategories: async (req, res) => {
    try {
      const categories = await Product.distinct('category', { isActive: true });
      res.json({ categories: categories.sort() });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = productController;
