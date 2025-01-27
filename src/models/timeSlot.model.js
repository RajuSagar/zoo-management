const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  slot: String
});

const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema);

module.exports = TimeSlot;
