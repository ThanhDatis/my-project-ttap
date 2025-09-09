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
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Name is required';
  }

  if (data.email && data.email.trim().length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      errors.email = 'Email is invalid';
    }
  }

  if (data.phone && data.phone.trim().length > 0) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(data.phone.trim()) || data.phone.trim().length < 9 || data.phone.trim().length > 15) {
      errors.phone = 'Phone number is invalid';
    }
  }
  return errors;
}

const customerController = {
  getAll: asyncHandler(async (req, res) => {
    const {
      search = '',
      // tier,
      sort = 'createdAt:desc',
      page = 1,
      limit = 10,
    } = req.query;

    const filters = { isActive: true };
    if (search) {
      const regex = new RegExp(search, 'i');
      filters.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
        { address: regex },
        { city: regex },
        { district: regex },
        { ward: regex },
      ];
    }

    // if (tier && tier !== 'all') {
    //   filters.tier = tier;
    // }

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
      city: c.city,
      district: c.district,
      ward: c.ward,
      isActive: c.isActive,
      // tier: c.tier,
      // totalOrders: c.totalOrders,
      // lifetimeValue: c.lifetimeValue,
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
    try {
      console.log('Creating customer with data:', req.body);

      const data = req.body;
      const errors = validateCustomer(data);

      if (Object.keys(errors).length > 0) {
        console.log('Validation errors:', errors);
        return fail(res, 400, 'Validation failed', errors);
      }

      // Check for existing email if provided
      if (data.email && data.email.trim()) {
        const existingEmail = await Customer.findOne({
          email: data.email.trim().toLowerCase(),
          isActive: true
        });
        if (existingEmail) {
          return fail(res, 400, 'Email already exists');
        }
      }

      // Check for existing phone if provided
      if (data.phone && data.phone.trim()) {
        const existingPhone = await Customer.findOne({
          phone: data.phone.trim(),
          isActive: true
        });
        if (existingPhone) {
          return fail(res, 400, 'Phone number already exists');
        }
      }

      const allowed = pick(data, [
        'name',
        'email',
        'phone',
        'address',
        'city',
        'district',
        'ward',
      ]);

      // Clean up empty strings
      Object.keys(allowed).forEach(key => {
        if (allowed[key] === '') {
          delete allowed[key];
        } else if (typeof allowed[key] === 'string') {
          allowed[key] = allowed[key].trim();
        }
      });

      // Ensure name is provided
      if (!allowed.name) {
        return fail(res, 400, 'Customer name is required');
      }

      console.log('Creating customer with clean data:', allowed);

      const doc = new Customer(allowed);
      await doc.save();

      console.log('Customer created successfully:', doc);
      return ok(res, { item: doc });

    } catch (error) {
      console.error('Create customer error:', error);

      // Handle MongoDB duplicate key errors
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return fail(res, 400, `${field} already exists`);
      }

      // Handle validation errors
      if (error.name === 'ValidationError') {
        const validationErrors = {};
        Object.keys(error.errors).forEach(key => {
          validationErrors[key] = error.errors[key].message;
        });
        return fail(res, 400, 'Validation failed', validationErrors);
      }

      return fail(res, 500, 'Internal server error');
    }
  }),

  update: asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return fail(res, 400, 'Invalid customer ID');
      }

      const data = req.body;

      // For update, we don't require name if it's not being changed
      const errors = validateCustomer({ ...data, name: data.name || 'dummy' });
      if (!data.name) delete errors.name; // Remove name error if not updating name

      if (Object.keys(errors).length > 0) {
        return fail(res, 400, 'Validation failed', errors);
      }

      const allowed = pick(data, [
        'name',
        'email',
        'phone',
        'address',
        'city',
        'district',
        'ward',
      ]);

      // Clean up empty strings
      Object.keys(allowed).forEach(key => {
        if (allowed[key] === '') {
          allowed[key] = null;
        } else if (typeof allowed[key] === 'string') {
          allowed[key] = allowed[key].trim();
        }
      });

      const updated = await Customer.findOneAndUpdate(
        { _id: id, isActive: true },
        allowed,
        { new: true, runValidators: true }
      );

      if (!updated) {
        return fail(res, 404, 'Customer not found');
      }

      return ok(res, { item: updated });

    } catch (error) {
      console.error('Update customer error:', error);

      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return fail(res, 400, `${field} already exists`);
      }

      if (error.name === 'ValidationError') {
        const validationErrors = {};
        Object.keys(error.errors).forEach(key => {
          validationErrors[key] = error.errors[key].message;
        });
        return fail(res, 400, 'Validation failed', validationErrors);
      }

      return fail(res, 500, 'Internal server error');
    }
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

    return ok(res, { message: 'Customer deleted successfully' });
  }),
};

export default customerController;
