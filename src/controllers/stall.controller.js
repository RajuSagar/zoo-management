const Stall = require('../models/stall.model');

const addStall = async (req, res) => {
    try {
      const { name, price, stallType, image, totalTickets,  description } = req.body;
      // Directly add author and category IDs to the book
      const newStall = new Stall({
        name, 
        price, 
        stallType, 
        image:req.file.filename, 
        totalTickets,  
        description
      });
  
      const stall = await newStall.save();
      res.json(stall);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

const editStall = async (req, res) => {
  try {
    const {stallId} = req.params;
    const { name, price, totalTickets, description } = req.body;

    var stall = await Stall.findOne({_id:stallId});
    stall.name = name;          
    stall.price = price; 
    stall.totalTickets = totalTickets;  
    stall.description = description;
    await stall.save();
    res.status(200).json('stall edited successfully');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const editStallStatus = async (req, res) => {
  try {
    const {stallId} = req.params;
    const { status } = req.body;

    var stall = await Stall.findOne({_id:stallId});
    stall.status = status;          
    await stall.save();

    res.status(200).json('stall edited successfully');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const allStalls = async (req, res) => {
    try {
      const stalls = await Stall.find()
      res.status(200).json(stalls);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

const getStallById = async(req, res) => {
    try {
        const stallId = req.params.stallId;
        const stall = await Stall.findOne({_id:stallId});
        res.status(200).json(stall);
      } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getStallTicketsCount = async(req, res) => {
  try {
      const stallId = req.params.stallId;
      const stall = await Stall.findOne({_id:stallId});
      res.status(200).json(stall.totalTickets);
    } catch (error) {
      res.status(500).json({ error: error.message });
  }
}

module.exports = {
    addStall,
    allStalls,
    getStallById,
    getStallTicketsCount,
    editStall,
    editStallStatus
}