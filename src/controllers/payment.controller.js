const Payment = require('../models/payment.model');

const addPayment = async (req, res) => {
    try {
      const { booking, customer, stall, amount, cardNumber, holderName, cvv, totalTickets } = req.body;

      const newPayment = new Payment({
        booking, 
        customer, 
        stall, 
        amount, 
        cardNumber, 
        holderName, 
        cvv,
        totalTickets
      });
  
      const savedPayment = await newPayment.save();
      res.json(savedPayment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}



const getPaymentsByBooking = async(req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const payments = await Payment.find({booking:bookingId});
        res.status(200).json(payments);
      } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const allPayments = async (req, res) => {
    try {
      const payments = await Payment.find()
      res.status(200).json(payments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

const cancelledPayments = async (req, res) => {
    try {
      const payments = await Payment.find({paymentStatus: 'Cancelled'}).populate('booking stall')
      res.status(200).json(payments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

const cancelledPaymentsByCustomer = async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const payments = await Payment.find({paymentStatus: 'Cancelled', customer:customerId }).populate('booking stall')
        res.status(200).json(payments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

// const getStallById = async(req, res) => {
//     try {
//         const stallId = req.params.stallId;
//         const payments = await Payment.findOne({_id:stallId});
//         res.status(200).json(payments);
//       } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }

// const getStallTicketsCount = async(req, res) => {
//   try {
//       const stallId = req.params.stallId;
//       const payments = await Payment.findOne({_id:stallId});
//       res.status(200).json(payments.totalTickets);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//   }
// }

module.exports = {
    addPayment,
    allPayments,
    getPaymentsByBooking,
    cancelledPayments,
    cancelledPaymentsByCustomer
}