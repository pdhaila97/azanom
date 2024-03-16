const jwt = require('jsonwebtoken');
const { Feedback, ContactUs } = require('../models/Miscellaneous');

const feedback = async (req, res, next) => {
  const { email, name, comment } = req.body;

  try {
    const feedback = new Feedback({ name, email, comment });
    await feedback.save();
    
    res.json({ message: 'Feedback shared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

const contactUs = async (req, res, next) => {
    const { email, name, mobileNumber } = req.body;
  
    try {
      const contactUs = new ContactUs({ name, email, mobileNumber });
      await contactUs.save();
      
      res.json({ message: 'Contact info has been shared with our CS team successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
};

module.exports = { feedback, contactUs };