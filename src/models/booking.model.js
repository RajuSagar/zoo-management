const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    name: { type: String },
    age: { type: Number },
});

const rideSchema = new mongoose.Schema({
  ride: { type: mongoose.Schema.Types.ObjectId, ref: 'Stall' },
  totalTickets: Number,
  totalPrice: Number
});

const activitySchema = new mongoose.Schema({
  activity: { type: mongoose.Schema.Types.ObjectId, ref: 'Stall' },
  totalTickets: Number,
  totalPrice: Number
});

const bookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' },
  adultTickets: [personSchema],
  childrenTickets: [personSchema],
  seniorTickets: [personSchema],
  handicappedTickets: [personSchema],
  totalTickets: Number,
  totalPrice: Number,
  totalBookingPrice: Number,
  ride: rideSchema ,
  activity:  [activitySchema],
  bookingDate: { type: Date, default: Date.now },
  status: String,
  schedule: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
