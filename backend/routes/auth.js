const express = require('express');
const { register, login, changePassword } = require('../controllers/auth');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/change-password', authenticate, changePassword);

module.exports = router;