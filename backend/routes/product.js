const express = require('express');
const { authenticate } = require('../middlewares/auth');
const { addNewProduct, getUserProducts, getAllProducts, deleteProduct, buyProduct } = require('../controllers/product');

const router = express.Router();

router.post('/add', authenticate, addNewProduct);
router.get('/get', authenticate, getUserProducts);
router.get('/get-all', authenticate, getAllProducts);
router.post('/delete', authenticate, deleteProduct);
router.post('/buy', authenticate, buyProduct);

module.exports = router;