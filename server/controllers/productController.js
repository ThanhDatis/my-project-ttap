import mongoose from 'mongoose';
import Product from '../models/product.js';

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;
const ALLOWED_FIELDS = ['name', 'description', 'price', 'category', 'stock', 'sku', 'images', 'isActive'];
const pick = (obj, fields) => fields.reduce((acc, field) => (obj[field] !== undefined ? ((acc[field] = obj[field]), acc) : acc), {});

const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const isValidObjectId = id => mongoose.Types.ObjectId.isValid(id);

const isAdmin = user => user && (user.role === 'admin' || user.role === 'superadmin');

const validateProduct = (payload, { partial = false } = {}) => {
  const errors = [];

  const mustBeString = ['name', 'description', 'category', 'sku'];
  const mustBeNumber = ['price', 'stock'];

  if (!partial) {
    ['name', 'description', 'price', 'category', 'sku'].forEach((key) => {
      if (payload[key] === undefined || payload[key] === null || payload[key] === '') {
        errors.push(`${key} is required`);
      }
    });
  }

  mustBeString.forEach((key) => {
    if (payload[key] !== undefined && typeof payload[key] !== 'string') {
      errors.push(`${key} must be a string`);
    }
  });
  mustBeNumber.forEach((key) => {
    if (payload[key] !== undefined && typeof payload[key] !== 'number') {
      errors.push(`${key} must be a number`);
    }
    if (payload[key] !== undefined && typeof payload[key] === 'number' && payload[key] < 0 ) {
      errors.push(`${key} must be >= 0`);
    }
  });

  if (payload.images !== undefined && !Array.isArray(payload.images)) {
    errors.push('Images must be an array');
  }
  return errors;
};

const ok = (res, data, message = 'OK', status = 200) => {
  res.status(status).json({ success: true, message, data });
};

const fail = (res, message = 'Internal Server Error', status = 400, errors = []) => {
  res.status(status).json({ success: false, message, errors });
};

const productController = {
  getAll: asyncHandler(async (req, res) => {
    let {
      page = DEFAULT_PAGE,
      limit = DEFAULT_LIMIT,
      category,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
      } = req.query;

      page = parseInt(page, 10) || DEFAULT_PAGE;
      limit = Math.min(parseInt(limit, 10) || DEFAULT_LIMIT, MAX_LIMIT);
      const query = { isActive: true };


      if (category && category !== 'all') {
        query.category = category.toString().toLowerCase().trim();
      }

      if (search && String(search).trim()) {
        query.$text = {
          $search: String(search).trim(),
        };
      }
      const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

      const [items, total] = await Promise.all([
        Product.find(query)
          .populate('createdBy', 'name email')
          .sort(sort)
          .limit(limit)
          .skip((page - 1) * limit),
        Product.countDocuments(query)
      ]);
      return ok(res, {
        items: items.map(p => ({
          id: p._id.toString(),
          name: p.name,
          sku: p.sku,
          price: p.price,
          stock: p.stock,
          category: p.category,
          isActive: p.isActive,
          images: p.images || [],
          description: p.description,
          createdBy: p.createdBy ? {
            _id: p.createdBy._id.toString(),
            name: p.createdBy.name,
            email: p.createdBy.email
          } : null,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: (page * limit) < total,
          hasPreviousPage: page > 1
        },
      }, 'Fetched products'
    );
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return fail(res, 'Invalid product ID', 400);
    }

    const product = await Product.findById(id);
    if (!product || !product.isActive) {
      return fail(res, 'Product not found', 404);
    }

    return ok(res, product, 'Fetched product');
  }),

  create: asyncHandler(async (req, res) => {
    if (!isAdmin(req.user)) {
      return fail(res, 'Forbidden', 403);
    }
    const body = pick(req.body, ALLOWED_FIELDS);
    const errors = validateProduct(body, { partial: false });
    if (errors.length) {
      return fail(res, 'Validation errors', 422, errors);
    }
    const productData = {
        ...body,
        category: body.category?.toLowerCase().trim(),
        sku: body.sku?.toUpperCase().trim(),
        createdBy: req.user._id
      };

      const newProduct = await Product.create(productData);
      await newProduct.populate('createdBy', 'name email');

      return ok(res, {
          id: newProduct._id.toString(),
          name: newProduct.name,
          sku: newProduct.sku,
          price: newProduct.price,
          stock: newProduct.stock,
          category: newProduct.category,
          description: newProduct.description,
          isActive: newProduct.isActive,
          images: newProduct.images || [],
          createdAt: newProduct.createdAt?.toISOString(),
          updatedAt: newProduct.updatedAt?.toISOString(),
          createdBy: newProduct.createdBy ? {
            _id: newProduct.createdBy._id.toString(),
            name: newProduct.createdBy.name,
            email: newProduct.createdBy.email
          } : null,
        }, 'Product created successfully', 201
      );
  }),

  update: asyncHandler(async (req, res) => {
    // const product = await Product.findById(req.params.id);
    if (!isAdmin(req.user)) {
        return fail(res, 'Forbidden', 403);
    }
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return fail(res, 'Invalid product ID', 400);
    }

    const body = pick(req.body, ALLOWED_FIELDS);
    const errors = validateProduct(body, { partial: true });
    if (errors.length) {
      return fail(res, 'Validation errors', 422, errors);
    }

    const exists = await Product.findById(id);
    if (!exists) {
      return fail(res, 'Product not found', 404);
    }

    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
          ...body,
          ...(body.category ? { category: body.category.toLowerCase().trim() } : {}),
          ...(body.sku ? { sku: body.sku.toUpperCase().trim() } : {}),
        },
        { new: true, runValidators: true }
      ).populate('createdBy', 'name email');

      return ok(res, updatedProduct, 'Product updated successfully');
    } catch (error) {
      if (error.code === 11000) {
        return fail(res, 'SKU must be unique', 409);
      }
      return fail(res, 'Failed to update product', 500);
    }
  }),

  delete: async (req, res) => {
    if (!isAdmin(req.user)) {
      return fail(res, 'Forbidden', 403);
    }

    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return fail(res, 'Invalid product ID', 400);
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );

    if (!product) return fail(res, 'Product not found', 404);

    return ok(res, {
      id: product._id.toString(),
      name: product.name,
    }, 'Product deleted successfully');
  },

  getCategories: asyncHandler(async (req, res) => {
      const categories = await Product.distinct('category', { isActive: true });
      return ok(res, { categories: categories.sort() }, 'Fetched categories successfully');
  }),
};

export default productController;
