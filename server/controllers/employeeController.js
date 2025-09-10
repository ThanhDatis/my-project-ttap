import mongoose from 'mongoose';
import Employee from '../models/employee.js';
// import { all } from 'axios';
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

function validateEmployee(data = {}) {
  const errors = {};

  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Employee name is required';
  }

  if (data.email && data.email.trim().length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      errors.email = 'Invalid email format';
    }
  }

  if (data.phone && data.phone.trim().length > 0) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
    if (!phoneRegex.test(
      data.phone.trim())
      || data.phone.trim().length < 9
      || data.phone.trim().length > 15) {
      errors.phone = 'Invalid phone number format';
    }
  }

  if (!data.role || !['admin', 'manager', 'employee'].includes(data.role)) {
    errors.role = 'Invalid role';
  }

  if (data.gender && !['male', 'female', 'other'].includes(data.gender)) {
    errors.gender = 'Invalid gender';
  }

  if (data.status && !['active', 'inactive', 'suspended'].includes(data.status)) {
    errors.status = 'Invalid status';
  }
  return errors;
}

const employeeController = {
  getAll: asyncHandler(async (req, res) => {
    const {
      search = '',
      role,
      status,
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

    if (role && role !== 'all') {
      filters.role = role;
    }

    if (status && status !== 'all') {
      filters.status = status;
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
      Employee.find(filters)
      .populate('createdBy', 'name email')
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limitNum),
      Employee.countDocuments(filters),
    ]);

    const mapped = items.map((e) => ({
      id: e._id.toString(),
      name: e.name,
      email: e.email,
      phone: e.phone,
      dateOfBirth: e.dateOfBirth,
      gender: e.gender,
      role: e.role,
      address: e.address,
      city: e.city,
      district: e.district,
      ward: e.ward,
      status: e.status,
      isActive: e.isActive,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
      createdBy: e.createdBy,
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
      return fail(res, 400, 'Invalid employee ID');
    }

    const e = await Employee.findById(id)
      .populate('createdBy', 'name email');

    if (!e || !e.isActive) {
      return fail(res, 404, 'Employee not found');
    }

    return ok(res, { item: e });
  }),

  create: asyncHandler(async (req, res) => {
    try {
      const data = req.body;
      const errors = validateEmployee(data);

      if (Object.keys(errors).length > 0) {
        return fail(res, 400, 'Validation errors', errors);
      }

      if (data.email && data.email.trim()) {
        const existingEmail = await Employee.findOne({
          email: data.email.trim().toLowerCase(),
          isActive: true,
        });
        if (existingEmail) {
          return fail(res, 400, 'Email already exists');
        }
      }

      if (data.phone && data.phone.trim()) {
        const existingPhone = await Employee.findOne({
          phone: data.phone.trim(),
          isActive: true,
        });
        if (existingPhone) {
          return fail(res, 400, 'Phone number already exists');
        }
      }

      const allowed = pick(data, [
        'name',
        'email',
        'phone',
        'dateOfBirth',
        'gender',
        'role',
        'address',
        'city',
        'district',
        'ward',
        'isActive',
      ]);

      Object.keys(allowed).forEach(key => {
        if (allowed[key] === '') {
          delete allowed[key];
        } else if (typeof allowed[key] === 'string') {
          allowed[key] = allowed[key].trim();
        }
      });

      if (!allowed.name) {
        return fail(res, 400, 'Employee name is required');
      }

      allowed.createdBy = req.user.id;

      const doc = new Employee(allowed);
      await doc.save();

      await doc.populate('createdBy', 'name email');
      return ok(res, { item: doc });
    } catch (error) {
      console.error('Error creating employee:', error);

      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return fail(res, 400, `${field} already exists`);
      }

      if (error.name === 'ValidationError') {
        const validateErrors = {};
        Object.keys(error.errors).forEach((key) => {
          validateErrors[key] = error.errors[key].message;
        });
        return fail(res, 400, 'Validation errors', validateErrors);
      }
      return fail(res, 500, 'Server error');
    }
  }),

  update: asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return fail(res, 400, 'Invalid employee ID');
      }
      const data = req.body;
      const errors = validateEmployee({ ...data, name: data.name || 'valid' });

      if (!data.name) delete errors.name;

      if (Object.keys(errors).length > 0) {
        return fail(res, 400, 'Validation errors', errors);
      }

      if (data.email && data.email.trim()) {
        const existingEmail = await Employee.findOne({
          email: data.email.trim().toLowerCase(),
          _id: { $ne: id },
          isActive: true,
        });
        if (existingEmail) {
          return fail(res, 400, 'Email already exists');
        }
      }

      if (data.phone && data.phone.trim()) {
        const existingPhone = await Employee.findOne({
          phone: data.phone.trim(),
          _id: { $ne: id },
          isActive: true,
        });
        if (existingPhone) {
          return fail(res, 400, 'Phone number already exists');
        }
      }

      const allowed = pick(data, [
        'name',
        'email',
        'phone',
        'dateOfBirth',
        'gender',
        'role',
        'address',
        'city',
        'district',
        'ward',
        'isActive',
      ]);

      Object.keys(allowed).forEach(key => {
        if (allowed[key] === '') {
          delete allowed[key];
        } else if (typeof allowed[key] === 'string') {
          allowed[key] = allowed[key].trim();
        }
      });

      const updated = await Employee.findOneAndUpdate(
        { _id: id, isActive: true },
        allowed,
        { new: true, runValidators: true }
      ).populate('createdBy', 'name email');

      if (!updated) {
        return fail(res, 404, 'Employee not found');
      }
      return ok(res, { item: updated });
    } catch (error) {
      console.error('Error updating employee:', error);

      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return fail(res, 400, `${field} already exists`);
      }

      if (error.name === 'ValidationError') {
        const validateErrors = {};
        Object.keys(error.errors).forEach((key) => {
          validateErrors[key] = error.errors[key].message;
        });
        return fail(res, 400, 'Validation errors', validateErrors);
      }
      return fail(res, 500, 'Server error');
    }
  }),

  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return fail(res, 400, 'Invalid employee ID');
    }

    const deleted = await Employee.findOneAndUpdate(
      { _id: id, isActive: true },
      { isActive: false },
      { new: true }
    );
    if (!deleted) {
      return fail(res, 404, 'Employee not found');
    }
    return ok(res, { item: deleted });
  }),
};

export default employeeController;
