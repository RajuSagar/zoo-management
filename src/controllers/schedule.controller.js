const TimeSlot = require('../models/timeSlot.model');
const Schedule = require('../models/schedule.model');

const addSlot = async (req, res) => {
    try {
      const { slot } = req.body;
      // Directly add author and category IDs to the book
      const newSlot = new TimeSlot({
        slot
      });
  
      const savedslot = await newSlot.save();
      res.json(savedslot);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}


const allSlots = async (req, res) => {
    try {
      const slots = await TimeSlot.find()
      res.status(200).json(slots);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

const addSchedules = async (req, res) => {
    try {
        const { schedules } = req.body;

        const allSchedules = await Schedule.find();
        
        allSchedules.forEach(async element => {
            element.status = 'expired';
            await element.save();
        });

        schedules.forEach(async element => {
        element.slots.forEach(async slot => {
            await Schedule.create({  date: element.date, slot:slot.value });
        });
        });
        res.status(200);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

const allSchedules = async (req, res) => {
    try {
      const schedules = await Schedule.find().populate('slot');
      res.status(200).json(schedules);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

const activeSchedules = async (req, res) => {
    try {
      const schedules = await Schedule.find({status:'active'}).populate('slot');
      res.status(200).json(schedules);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

// const getStallById = async(req, res) => {
//     try {
//         const stallId = req.params.stallId;
//         const slot = await TimeSlot.findOne({_id:stallId});
//         res.status(200).json(slot);
//       } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }

// const getStallTicketsCount = async(req, res) => {
//   try {
//       const stallId = req.params.stallId;
//       const slot = await TimeSlot.findOne({_id:stallId});
//       res.status(200).json(slot.totalTickets);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//   }
// }

module.exports = {
    addSlot,
    allSlots,
    addSchedules,
    allSchedules,
    activeSchedules
}