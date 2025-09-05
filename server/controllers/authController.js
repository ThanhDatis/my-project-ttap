/* eslint-disable no-undef */
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

const authController = {
  signin: async (req, res) => {

    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const user = await User.findOne({ email: email.toLowerCase(), isActive: true });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = generateToken(user._id);
      res.json({
        message: 'Login successful',
        user: user.toJSON(),
        token,
        refreshToken: token
      })
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  signup: async (req, res) => {
    try {
      const { name, email, password, role = 'user' } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }

      const user = new User({
        name: name.trim(),
        email: email.toLowerCase(),
        password,
        role
      });

      await user.save();

      const token = generateToken(user._id);
      res.status(201).json({
        message: 'User created successfully',
        user: user.toJSON(),
        token,
        refreshToken: token
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  getProfile: async (req, res) => {
    try {
      res.json({ user: req.user.toJSON() });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  // getProfile: async (req, res) => {
  //   try {
  //     const user = await User.findById(req.user.id);
  //     if (!user) {
  //       return res.status(404).json({ message: 'User not found' });
  //     }
  //     res.json({ user: user.toJSON() });
  //   } catch (error) {
  //     return res.status(500).json({ message: 'Internal server error' });
  //   }
  // }
};

export default authController;
