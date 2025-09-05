/* global console */
import mongoose from 'mongoose';
import Customer from '../models/customer.js';

let Order;

try {
  const module = await import('../models/order.js');
  Order = module.default;
} catch (error) {
  console.error(error);
  Order = null;
}

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
  return res.status(code).json({ payload });
}

function validateCustomer(data = {}) {
  const errors = {};
  if (!data.name && data.name.trim().length === 0) {
    errors.name = 'Name is required';
  }

  if (data.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.email = 'Email is invalid';
    }
  }

  if (data.phone) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(data.phone)) {
      errors.phone = 'Phone number is invalid';
    }
  }
  return errors;
}

const customerController = {
  getAll: asyncHandler(async (req, res) => {
    const {
      search = '',
      tier,
      sort = 'createdAt:desc',
      page = 1,
      limit = 10,
    } = req.query;

    const filters = {};
    if (search) {
      const regex = new RegExp(search, 'i');
      filters.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    if (tier && tier !== 'all') {
      filters.tier = tier;
    }

    let sortField = 'createdAt';
    let sortOrder = -1;
    if (typeof sort === 'string') {
      const [field, direction] = sort.split(':');
      if (field) sortField = field;
      if (direction === 'asc') sortOrder = 1;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Customer.find(filters)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limitNum),
      Customer.countDocuments(filters),
    ]);

    const mapped = items.map((c) => ({
      id: c._id.toString(),
      name: c.name,
      email: c.email,
      phone: c.phone,
      address: c.address,
      tier: c.tier,
      totalOrders: c.totalOrders,
      lifetimeValue: c.lifetimeValue,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    return ok(res, {
      items: mapped,
      total,
      page: pageNum,
      limit: limitNum,
    });
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return fail(res, 400, 'Invalid customer ID');
    }
    const customer = await Customer.findById(id);
    if (!customer || !customer.isActive) {
      return fail(res, 404, 'Customer not found');
    }
    return ok(res, { item: customer });
  }),

  create: asyncHandler(async (req, res) => {
    const data = req.body;
    const errors = validateCustomer(data);
    if (Object.keys(errors).length > 0) {
      return fail(res, 400, 'Validation failed', errors);
    }

    const allowed = pick(data, [
      'name',
      'phone',
      'email',
      'address',
      'tier',
      'totalOrders',
      'lifetimeValue',
    ]);
    const doc = new Customer(allowed);
    await doc.save();
    return ok(res, { item: doc });
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return fail(res, 400, 'Invalid customer ID');
    }
    const data = req.body;
    const errors = validateCustomer({ ...data, name: data.name || 'dummy' });
    delete errors.name;
    if (Object.keys(errors).length > 0) {
      return fail(res, 400, 'Validation failed', errors);
    }
    const allowed = pick(data, [
      'name',
      'phone',
      'email',
      'address',
      'tier',
      'totalOrders',
      'lifetimeValue',
    ]);
    const updated = await Customer.findOneAndUpdate(
      { _id: id, isActive: true },
      allowed,
      { new: true },
    );
    if (!updated) {
      return fail(res, 404, 'Customer not found');
    }
    return ok(res, { item: updated });
  }),

  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return fail(res, 400, 'Invalid customer ID');
    }
    if (Order) {
      const hasActiveOrder = await Order.findOne({
        customerId: id,
        status: { $in: ['draft', 'confirmed', 'packed', 'shipped'] },
      });
      if (hasActiveOrder) {
        return fail(res, 400, 'Cannot delete customer with active orders');
      }
    }
    const deleted = await Customer.findOneAndUpdate(
      { _id: id, isActive: true },
      { isActive: false },
      { new: true },
    );
    if (!deleted) {
      return fail(res, 404, 'Customer not found');
    }
    return ok(res, { message: 'Customer deleted' });
  }),
};

export default customerController;
