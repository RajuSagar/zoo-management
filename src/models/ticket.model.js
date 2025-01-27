const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  name: String,
  priceForAdult: Number,
  priceForChildren: Number,
  priceForSenior: Number,
  priceForHandicapped: Number,
  totalNoOfTickets: Number,
  status: {type: String, default: "Active"}
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
