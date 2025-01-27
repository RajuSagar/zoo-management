const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});


customerSchema.pre('save', async function (next) {
  const customer = this;
  if (customer.isModified('password') || customer.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(customer.password, salt);
      
      customer.password = hash;
      next();
    } catch (err) {
      return next(err);
    }
  } else {
    return next();
  }
});

customerSchema.methods.generateAuthToken = async function () {
  return jwt.sign({ _id: this._id }, process.env.SECRET_KEY, {
    expiresIn: '1d', // Set token expiration time
  });
};

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
