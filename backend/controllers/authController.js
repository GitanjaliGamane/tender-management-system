// controllers/authController.js - Handles company registration and login
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '7d',
  });
};

// @desc    Register a new company
// @route   POST /api/auth/register
// @access  Public
const registerCompany = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Company with this email already exists' });
    }

    // Create new user
    const user = await User.create({ name, email, password });

    res.status(201).json({
      message: 'Company registered successfully',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Login company
// @route   POST /api/auth/login
// @access  Public
const loginCompany = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      message: 'Login successful',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Government hardcoded login
// @route   POST /api/auth/government-login
// @access  Public
const governmentLogin = (req, res) => {
  const { email, password } = req.body;

  // Hardcoded government credentials
  const GOVT_EMAIL = 'admin@gmail.com';
  const GOVT_PASSWORD = 'admin123';

  if (email === GOVT_EMAIL && password === GOVT_PASSWORD) {
    res.json({
      message: 'Government login successful',
      role: 'government',
      user: {
        name: 'Government Admin',
        email: GOVT_EMAIL,
      },
    });
  } else {
    res.status(401).json({ message: 'Invalid government credentials' });
  }
};

module.exports = { registerCompany, loginCompany, governmentLogin };
