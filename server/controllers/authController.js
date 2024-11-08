const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.register = async (req, res, next) => {
    console.log('register api hits')
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const userId = await User.create(name, email, password, role);
    const token = generateToken(userId);

    res.cookie('token', token, { httpOnly: true });
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user.id);

    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ message: 'Logged in successfully', token });
  } catch (error) {
    next(error);
  }
};


exports.logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
};
