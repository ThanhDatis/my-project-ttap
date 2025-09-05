/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

import authRoutes from './routes/auth.js';
import productRoutes from './routes/product.js';
import customerRoutes from './routes/customer.js';
import User from './models/user.js';

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017')
  .then(async () => {
    console.log('🍃 MongoDB Connected');

    const adminExists = await User.findOne({ email: 'admin@gmail.com' });

    if (!adminExists) {
      await User.create({
        name: 'Admin ABCD',
        email: 'admin@gmail.com',
        password: '123456',
        role: 'admin'
      });
      console.log('🍃 Admin user created');
    }
  })
  .catch(err => console.error('MongoDB connection failed:', err.message));


  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  }));

  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/customers', customerRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Sales Management API is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// app.get('/api/test', (req, res) => {
//   res.json({ message: 'Backend is working!' });
// });

app.use((err, req, res, next) => {
  console.error('🍃 Error occurred:', err.message);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
  });
});

app.listen(PORT, () => {
  console.log(`Backend Server running on port ${PORT}`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
  // console.log(`Test Route: http://localhost:${PORT}/api/test`);
  console.log(`Login: POST http://localhost:${PORT}/api/auth/signin`);
  console.log(`Products: GET http://localhost:${PORT}/api/products`);
  console.log(`Customers: GET http://localhost:${PORT}/api/customers`);
});

export default app;
