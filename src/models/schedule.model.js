const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  date: Date,
  slot: { type: mongoose.Schema.Types.ObjectId, ref: 'TimeSlot' },
  status: {type: String, default: 'active'}
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
