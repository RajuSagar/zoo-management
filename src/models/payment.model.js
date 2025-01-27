const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  stall: { type: mongoose.Schema.Types.ObjectId, ref: 'Stall' },
  amount: Number,
  date: { type: Date, default: Date.now },
  cardNumber: Number,
  holderName: String,
  cvv: Number,
  totalTickets: Number,
  paymentStatus: { type: String, default: 'paid'}

});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
