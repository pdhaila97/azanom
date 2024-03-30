const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const {
  checkPasswordValidity2,
  validUserTypes,
  getSanitizedParams,
} = require("../utils/helperMethods");
const { isEmpty } = require("lodash");
const Joi = require("joi");

// Register a new user
const register = async (req, res, next) => {
  const { name, email, password, type } = getSanitizedParams(req.body, ['name', 'email', 'password', 'type']);

  try {
    const inputSchema = Joi.object({
      name: Joi.string().min(3).max(25),
      email: Joi.string().email(),
      password: Joi.string().custom(checkPasswordValidity2),
      type: Joi.string().allow(...validUserTypes),
    });

    const { error } = inputSchema.validate({
      name,
      email,
      password,
      type,
    });

    if (!isEmpty(error)) {
      throw error;
    }

    const user = new User({ name, email, password, type });
    await user.save();
    res.json({ message: "Registration successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login with an existing user
const login = async (req, res, next) => {
  const { email, password } = getSanitizedParams(req.body, ['email', 'password']);

  try {
    const inputSchema = Joi.object({
      email: Joi.string().email(),
      password: Joi.string().custom(checkPasswordValidity2),
    });

    const { error } = inputSchema.validate({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1 hour",
    });

    res.json({ token, name: user.name, email: user.email, type: user.type });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const changePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const { user } = req;

    if (!user) {
      return res.status(500).json({ message: "User not found" });
    }

    const inputSchema = Joi.object({
      currentPassword: Joi.string().custom(checkPasswordValidity2),
      newPassword: Joi.string().custom(checkPasswordValidity2),
    });

    const { error } = inputSchema.validate({
      currentPassword,
      newPassword,
    });

    if (!isEmpty(error)) {
      throw error;
    }

    const passwordMatch = await user.comparePassword(currentPassword);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Current Password Incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password Changed Successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, changePassword };
