import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
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
  address: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  district: {
    type: String,
    trim: true,
  },
  ward: {
    type: String,
    trim: true,
  },
  // tier: {
  //   type: String,
  //   enum: ['vip', 'normal'],
  //   default: 'normal',
  //   // lowercase: true,
  //   // trim: true,
  // },
  // totalOrders: {
  //   type: Number,
  //   default: 0,
  // },
  // lifetimeValue: {
  //   type: Number,
  //   default: 0,
  // },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.model('Customer', CustomerSchema);
