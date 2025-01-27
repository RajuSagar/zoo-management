const mongoose = require('mongoose');

const stallSchema = new mongoose.Schema({
  name: String,
  stallType: String,
  price: Number,
  image: String,
  totalTickets: Number,
  description: String,
  status:{type:String, default:"active"}
});

const Stall = mongoose.model('Stall', stallSchema);

module.exports = Stall;
