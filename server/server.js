/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017')
  .then(async () => {
    console.log('🍃 MongoDB Connected');

    const User = require('./models/user');
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
    error: process.env.NODE_ENV === 'production' ? err.message : 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`Backend Server running on port ${PORT}`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
  // console.log(`Test Route: http://localhost:${PORT}/api/test`);
  console.log(`Login: POST http://localhost:${PORT}/api/auth/signin`);
  console.log(`Products: GET http://localhost:${PORT}/api/products`);
});

module.exports = app;
