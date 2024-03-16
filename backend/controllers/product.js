const { filter } = require("lodash");
const Product = require("../models/Product");

const addNewProduct = async (req, res, next) => {
  const { title, price, category } = req.body;

  try {
    const { user } = req;

    if (!user) {
      return res.status(500).json({ message: "User not found" });
    }

    if (!title || !price || !category || (price < 0 || price > 999)) {
      return res
        .status(500)
        .json({ message: "Invalid parameters (title/price/category)" });
    }

    const product = new Product({ title, price, category });

    await product.save();
    user.listedProducts = [...(user.listedProducts || []), product.id];
    await user.save();
    const products = await Product.find({ _id: user.listedProducts || [], isSold: false});

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

    await Product.findByIdAndDelete({ _id });

    user.listedProducts = filter(user.listedProducts, productId => {
      return productId !== _id
    });
    await user.save();

    const products = await Product.find({ isSold: false, _id: user.listedProducts });

    res.json({ message: "Product added successfully", data: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const buyProduct = async (req, res, next) => {
  const { _id } = req.body;

  try {
    const { user } = req;

    if (!user) {
      return res.status(500).json({ message: "User not found" });
    }

    const product = await Product.findById({ _id });

    if(!product) {
      return res.status(500).json({ message: "Product not found" });
    }

    user.purchasedProducts = [...(user.purchasedProducts || []), product.id];

    product.isSold = true;

    await product.save();
    await user.save();

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
