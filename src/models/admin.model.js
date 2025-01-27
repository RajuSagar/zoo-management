const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});


adminSchema.pre('save', async function (next) {
  const admin = this;
  if (admin.isModified('password') || admin.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(admin.password, salt);
      
      admin.password = hash;
      next();
    } catch (err) {
      return next(err);
    }
  } else {
    return next();
  }
});

adminSchema.methods.generateAuthToken = async function () {
  return jwt.sign({ _id: this._id }, process.env.SECRET_KEY, {
    expiresIn: '1d', // Set token expiration time
  });
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
