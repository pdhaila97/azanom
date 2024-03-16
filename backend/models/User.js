const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { checkPasswordValidity } = require('../utils/helperMethods');

const validUserTypes = ['buyer', 'seller']

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: validUserTypes,
      default: 'buyer',
      required: true
    },
    listedProducts: [{
      type: String
    }],
    purchasedProducts: [{
      type: String
    }]
  },
  { timestamps: true }
);

// Hash the password before saving it to the database
userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  try {
    const {isValid: isPasswordValid, errors: passwordErrors = []} = checkPasswordValidity(this.password);
    if(!isPasswordValid) {
      throw new Error(passwordErrors.join('\n'))
    }

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

// Compare the given password with the hashed password in the database
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// TBD
// userSchema.methods.validate = function(obj) {
// 	var Joi = require('joi');
// 	var schema = {
// 		email: Joi.types.String().email().required(),
// 		password: Joi.types.String().min(8).max(30).custom(checkPasswordValidity).required(),
// 		name: Joi.types.String().required(),
// 		type: Joi.types.valid(...validUserTypes),
// 	}
// 	return Joi.validate(obj, schema);
// }

const User = mongoose.model('User', userSchema);

module.exports = User;