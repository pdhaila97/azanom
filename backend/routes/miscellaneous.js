const express = require('express');
const { feedback, contactUs } = require('../controllers/miscellaneous');

const router = express.Router();

router.post('/feedback', feedback);
router.post('/contact-us', contactUs);

module.exports = router;