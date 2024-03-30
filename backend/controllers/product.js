const { filter, isEmpty } = require("lodash");
const Product = require("../models/Product");
const Joi = require("joi");
const bcrypt = require('bcrypt');
const { Purchase } = require("../models/Miscellaneous");

const addNewProduct = async (req, res, next) => {
  const { title, price, category } = req.body;

  try {
    const { user } = req;

    if (!user) {
      return res.status(500).json({ message: "User not found" });
    }

    const inputSchema = Joi.object({
      title: Joi.string().max(20).min(3),
      price: Joi.number().min(1).max(999),
      category: Joi.string().min(3).max(12),
      type: Joi.string().valid('seller')
    });

    const { error } = inputSchema.validate({
      title, price, category, type: user.type
    })

    if (!isEmpty(error)) {
      throw error;
    }

    const product = new Product({ title, price, category });

    await product.save();
    user.listedProducts = [...(user.listedProducts || []), product.id];
    await user.save();
    const products = await Product.find({ _id: user.listedProducts || []});

    res.json({ message: "Product added successfully", data: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res, next) => {
  const { _id } = req.body;

  try {
    const { user } = req;

    if (!user) {
      return res.status(500).json({ message: "User not found" });
    }

    const inputSchema = Joi.object({
      _id: Joi.string().required(),
      type: Joi.string().valid('seller'),
      isSold: Joi.valid(false).error(new Error('Sold item cannot be deleted'))
    });

    const product = await Product.findById({ _id });

    const { error } = inputSchema.validate({
      _id, type: user.type, isSold: product.isSold
    })

    if (!isEmpty(error)) {
      throw error;
    }

    await product.deleteOne();

    user.listedProducts = filter(user.listedProducts, productId => {
      return productId !== _id
    });
    
    await user.save();

    const products = await Product.find({ _id: user.listedProducts });

    res.json({ message: "Product added successfully", data: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const buyProduct = async (req, res, next) => {
  const { _id, nameOnCard, cardNumber, cvv } = req.body;

  try {
    const { user } = req;

    if (!user) {
      return res.status(500).json({ message: "User not found" });
    }

    const inputSchema = Joi.object({
      nameOnCard: Joi.string().min(3).max(25),
      cardNumber: Joi.string().creditCard(),
      cvv: Joi.number().valid(108).error(new Error('Invalid CVV')),
      type: Joi.string().valid('buyer'),
      isSold: Joi.valid(false).error(new Error('Item is already sold'))
    });

    const product = await Product.findById({ _id });

    if(!product) {
      return res.status(500).json({ message: "Product not found" });
    }

    const { error } = inputSchema.validate({
      nameOnCard, cardNumber, cvv, type: user.type, isSold: product.isSold
    });

    if(error) {
      throw error;
    }

    user.purchasedProducts = [...(user.purchasedProducts || []), product.id];

    product.isSold = true;

    const salt = await bcrypt.genSalt();
    const encCardNumber = await bcrypt.hash(cardNumber, salt);

    const purchase = new Purchase({
      cardNumber: encCardNumber,
      nameOnCard,
      userId: user._id,
      productId: _id
    });

    await product.save();
    await user.save();
    await purchase.save();

    const products = await Product.find({ isSold: false });

    const purchases = await Product.find({ _id: user.purchasedProducts });

    res.json({ message: "Product purchased successfully", data: {products, purchases} });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserProducts = async (req, res, next) => {

  try {
    const { user } = req;

    if (!user) {
      return res.status(500).json({ message: "User not found" });
    }

    const products = await Product.find({ _id: user.listedProducts || [] });

    res.json({ data: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllProducts = async (req, res, next) => {

  try {
    const { user } = req;

    if (!user) {
      return res.status(500).json({ message: "User not found" });
    }

    const products = await Product.find({isSold: false});

    const purchases = await Product.find({_id: user.purchasedProducts});

    res.json({ data: {products, purchases} });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addNewProduct, getUserProducts, getAllProducts, deleteProduct, buyProduct };
