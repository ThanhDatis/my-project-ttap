import mongoose from 'mongoose';
import Order from '../models/order.js';
import Customer from '../models/customer.js';
import Product from '../models/product.js';

function pick(obj, keys) {
  return keys.reduce((acc, key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

function ok(res, data) {
  res.json({ success: true, ...data });
}

function fail(res, code, message, errors = undefined) {
  const payload = { success: false, message };
  if (errors) payload.errors = errors;
  res.status(code).json(payload);
}

function validateOrder(data = {}) {
  const errors = {};

  if (!data.customerId || !mongoose.Types.ObjectId.isValid(data.customerId)) {
    errors.customerId = 'Valid customer ID is required';
  }

  if (!data.customerName || data.customerName.trim().length === 0) {
    errors.customerName = 'Customer name is required';
  }

  if (!data.paymentMethod || !['cash', 'credit_card', 'bank_transfer', 'e_wallet'].includes(data.paymentMethod)) {
    errors.paymentMethod = 'Valid payment method is required';
  }

  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    errors.items = 'At least one item is required';
  } else {
    data.items.forEach((item, index) => {
      if (!item.productId || !mongoose.Types.ObjectId.isValid(item.productId)) {
        errors[`items[${index}].productId`] = 'Valid product ID is required';
      }
      if (!item.quantity || item.quantity < 1) {
        errors[`items[${index}].quantity`] = 'Quantity must be at least 1';
      }
      if (!item.price || item.price < 0) {
        errors[`items[${index}].price`] = 'Price must be positive';
      }
    });
  }

  if (data.customerEmail && data.customerEmail.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.customerEmail.trim())) {
      errors.customerEmail = 'Invalid email format';
    }
  }

  return errors;
}

const orderController = {
  getAll: asyncHandler(async (req, res) => {
    const {
      search = '',
      status,
      paymentMethod,
      sort = 'createdAt:desc',
      page = 1,
      limit = 10,
    } = req.query;

    const filters = { isActive: true };

    if (search) {
      const regex = new RegExp(search, 'i');
      filters.$or = [
        { orderId: regex },
        { customerName: regex },
        { customerEmail: regex },
        { customerPhone: regex },
      ];
    }

    if (status && status !== 'all') {
      filters.status = status;
    }

    if (paymentMethod && paymentMethod !== 'all') {
      filters.paymentMethod = paymentMethod;
    }

    let sortField = 'createdAt';
    let sortOrder = -1;
    if (typeof sort === 'string') {
      const [field, dir] = sort.split(':');
      if (field) sortField = field;
      if (dir === 'asc') sortOrder = 1;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Order.find(filters)
        .populate('customerId', 'name email phone')
        .populate('createdBy', 'name email')
        .populate('items.productId', 'name sku')
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(filters),
    ]);

    const mapped = items.map((order) => ({
      id: order._id.toString(),
      orderId: order.orderId,
      customerId: order.customerId?._id?.toString(),
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      items: order.items.map(item => ({
        id: item._id?.toString(),
        productId: item.productId?._id?.toString(),
        productName: item.productName,
        sku: item.sku,
        quantity: item.quantity,
        price: item.price,
        lineTotal: item.lineTotal,
      })),
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      notes: order.notes,
      isActive: order.isActive,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      createdBy: order.createdBy,
    }));

    return ok(res, {
      items: mapped,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      hasNextPage: pageNum < Math.ceil(total / limitNum),
      hasPrevPage: pageNum > 1,
    });
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return fail(res, 400, 'Invalid order ID');
    }

    const order = await Order.findById(id)
      .populate('customerId', 'name email phone')
      .populate('createdBy', 'name email')
      .populate('items.productId', 'name sku');

    if (!order || !order.isActive) {
      return fail(res, 404, 'Order not found');
    }

    return ok(res, { item: order });
  }),

  create: asyncHandler(async (req, res) => {
    try {
      const data = req.body;
      const errors = validateOrder(data);

      if (Object.keys(errors).length > 0) {
        return fail(res, 400, 'Validation errors', errors);
      }

      const customer = await Customer.findById(data.customerId);
      if (!customer || !customer.isActive) {
        return fail(res, 400, 'Customer not found');
      }

      const processedItems = [];
      for (const item of data.items) {
        const product = await Product.findById(item.productId);
        if (!product || !product.isActive) {
          return fail(res, 400, `Product ${item.productName || item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          return fail(res, 400, `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
        }

        const lineTotal = Number(item.quantity) * Number(item.price);
        processedItems.push({
          productId: item.productId,
          productName: product.name,
          sku: product.sku,
          quantity: Number(item.quantity),
          price: Number(item.price),
          lineTotal,
        });
      }

      // const tax = Number(data.tax) || 0;
      const subtotal = processedItems.reduce((sum, item) => sum + item.lineTotal, 0);
      const total = subtotal;

      const allowed = {
        orderId: String(data.orderId || '').trim(),
        customerId: data.customerId,
        customerName: String(data.customerName || '').trim(),
        customerEmail: data.customerEmail?.trim() || undefined,
        customerPhone: data.customerPhone?.trim() || undefined,
        paymentMethod: data.paymentMethod,
        items: processedItems,
        subtotal,
        total,
        notes: data.notes?.trim() || undefined,
        // tax,
        createdBy: req.user._id,
      };

      allowed.items = processedItems;
      allowed.createdBy = req.user._id;

      const order = new Order(allowed);
      await order.save();

      for (const item of processedItems) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: -item.quantity } }
        );
      }

      await order.populate([
        { path: 'customerId', select: 'name email phone' },
        { path: 'createdBy', select: 'name email' },
        { path: 'items.productId', select: 'name sku' }
      ]);

      return ok(res, { item: order });
    } catch (error) {
      console.error('Error creating order:', error);

      if (error.code === 11000) {
        return fail(res, 400, 'Order ID already exists');
      }

      if (error.name === 'ValidationError') {
        const validationErrors = {};
        Object.keys(error.errors).forEach(key => {
          validationErrors[key] = error.errors[key].message;
        });
        return fail(res, 400, 'Validation errors', validationErrors);
      }

      return fail(res, 500, 'Server error');
    }
  }),

  update: asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return fail(res, 400, 'Invalid order ID');
      }

      const data = req.body;
      const existingOrder = await Order.findById(id);
      if (!existingOrder || !existingOrder.isActive) {
        return fail(res, 404, 'Order not found');
      }

      // Only allow certain fields to be updated
      const allowed = pick(data, [
        'status',
        'paymentStatus',
        'notes',
      ]);

      allowed.updatedBy = req.user._id;

      const updated = await Order.findByIdAndUpdate(
        id,
        allowed,
        { new: true, runValidators: true }
      ).populate([
        { path: 'customerId', select: 'name email phone' },
        { path: 'createdBy', select: 'name email' },
        { path: 'updatedBy', select: 'name email' },
        { path: 'items.productId', select: 'name sku' }
      ]);

      return ok(res, { item: updated });
    } catch (error) {
      console.error('Error updating order:', error);

      if (error.name === 'ValidationError') {
        const validationErrors = {};
        Object.keys(error.errors).forEach(key => {
          validationErrors[key] = error.errors[key].message;
        });
        return fail(res, 400, 'Validation errors', validationErrors);
      }

      return fail(res, 500, 'Server error');
    }
  }),

  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return fail(res, 400, 'Invalid order ID');
    }

    const order = await Order.findById(id);
    if (!order || !order.isActive) {
      return fail(res, 404, 'Order not found');
    }

    // Only allow deletion if order is in certain states
    if (!['pending', 'cancelled'].includes(order.status)) {
      return fail(res, 400, 'Cannot delete order in current status');
    }

    // Restore product stock if order is being deleted
    if (order.status === 'pending') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: item.quantity } }
        );
      }
    }

    const deleted = await Order.findByIdAndUpdate(
      id,
      { isActive: false, updatedBy: req.user._id },
      { new: true }
    );

    return ok(res, { item: deleted });
  }),

  // Get customers for autocomplete
  getCustomersForAutocomplete: asyncHandler(async (req, res) => {
    const { search = '' } = req.query;

    const filters = { isActive: true };
    if (search) {
      const regex = new RegExp(search, 'i');
      filters.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
      ];
    }

    const customers = await Customer.find(filters)
      .select('name email phone')
      .limit(20)
      .sort({ name: 1 });

    return ok(res, { items: customers });
  }),

  // Get products for order items
  getProductsForOrder: asyncHandler(async (req, res) => {
    const { search = '' } = req.query;

    const filters = { isActive: true, stock: { $gt: 0 } };
    if (search) {
      const regex = new RegExp(search, 'i');
      filters.$or = [
        { name: regex },
        { sku: regex },
      ];
    }

    const products = await Product.find(filters)
      .select('name sku price stock')
      .limit(50)
      .sort({ name: 1 });

    return ok(res, { items: products });
  }),
};

export default orderController;
