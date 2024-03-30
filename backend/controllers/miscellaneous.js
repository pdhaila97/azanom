const jwt = require("jsonwebtoken");
const { Feedback, ContactUs } = require("../models/Miscellaneous");
const Joi = require("joi");

const feedback = async (req, res, next) => {
  const { email, name, comment } = req.body;

  try {
    const inputSchema = Joi.object({
      email: Joi.string().required().email(),
      name: Joi.string().required().min(3).max(25),
      feedback: Joi.string().required().min(3).max(200),
    });

    const { error } = inputSchema.validate({
      email,
      name,
      feedback: comment,
    });

    if (error) {
      throw error;
    }

    const feedback = new Feedback({ name, email, comment });
    await feedback.save();

    res.json({ message: "Feedback shared successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const contactUs = async (req, res, next) => {
  const { email, name, mobileNumber } = req.body;

  try {
    const inputSchema = Joi.object({
      email: Joi.string().required().email(),
      name: Joi.string().required().min(3).max(25),
      mobileNumber: Joi.number().required().min(1).max(9999999999),
    });

    const { error } = inputSchema.validate({
      email,
      name,
      mobileNumber,
    });

    if (error) {
      throw error;
    }

    const contactUs = new ContactUs({ name, email, mobileNumber });
    await contactUs.save();

    res.json({
      message: "Contact info has been shared with our CS team successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { feedback, contactUs };
