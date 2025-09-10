import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Employee name is required'],
    trim: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    default: 'other'
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'staff'],
    default: 'staff',
    required: [true, 'Role is required']
  },
  address: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  district: {
    type: String,
    trim: true
  },
  ward: {
    type: String,
    trim: true
  },
  // status: {
  //   type: String,
  //   enum: ['active', 'inactive', 'suspended'],
  //   default: 'active'
  // },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Created by is required']
  },
}, { timestamps: true });

EmployeeSchema.index({ name: 'text', email: 'text', phone: 'text' });
EmployeeSchema.index({ role: 1, status: 1, isActive: 1 });
EmployeeSchema.index({ createdAt: 1 });
export default mongoose.model('Employee', EmployeeSchema);
