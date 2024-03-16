const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Register a new user
const register = async (req, res, next) => {
  const { name, email, password, type } = req.body;

  try {
    const user = new User({ name, email, password, type });
    await user.save();
    res.json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

// Login with an existing user
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Invalid Credentials' });
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1 hour'
    });
    
    res.json({ token, name: user.name, email: user.email, type: user.type });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

const changePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const { user } = req;
    
    if (!user) {
      return res.status(500).json({ message: 'User not found' });
    }

    const passwordMatch = await user.comparePassword(currentPassword);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Current Password Incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password Changed Successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

module.exports = { register, login, changePassword };