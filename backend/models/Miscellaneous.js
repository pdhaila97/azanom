const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    comment: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const contactUsSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    mobileNumber: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

const purchaseSchema = new mongoose.Schema({
  nameOnCard: {
    type: String,
    required: true
  },
  cardNumber: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  productId: {
    type: String,
    required: true
  }
},
{ timestamps: true })

const Feedback = mongoose.model('Feedback', feedbackSchema);
const ContactUs = mongoose.model('ContactUs', contactUsSchema);
const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = { Feedback, ContactUs, Purchase };