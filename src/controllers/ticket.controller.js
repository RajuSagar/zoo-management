const Ticket = require('../models/ticket.model');
const Booking = require('../models/booking.model');
const Stall = require('../models/stall.model');
const Payment = require('../models/payment.model');

const addTicket = async (req, res) => {
    try {
      const { name, priceForAdult, priceForChildren, priceForSenior, priceForHandicapped, totalNoOfTickets } = req.body;

      const newTicket = new Ticket({
        name,
        priceForAdult, 
        priceForChildren, 
        priceForSenior, 
        priceForHandicapped, 
        totalNoOfTickets
      });
  
      const savedTicket = await newTicket.save();
      res.json(savedTicket);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

const editTicket = async (req, res) => {
  try {
    const {ticketId} = req.params;
    const { name, priceForAdult, priceForChildren, priceForSenior, priceForHandicapped, totalNoOfTickets } = req.body;
    var ticket = await Ticket.findOne({_id:ticketId});

    ticket.name = name;
    ticket.priceForAdult = priceForAdult; 
    ticket.priceForChildren = priceForChildren; 
    ticket.priceForSenior = priceForSenior; 
    ticket.priceForHandicapped = priceForHandicapped; 
    ticket.totalNoOfTickets = totalNoOfTickets;

    await ticket.save();
    res.status(200).json({ message: 'Ticket updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const allTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const changeTicketStatus = async(req, res) => {
  try {
    const ticketId = req.params.ticketId;
    const { status } = req.body;

    const existingTicket = await Ticket.findById({_id:ticketId});
    
    if (!existingTicket) {
    return res.status(404).json({ error: 'Book not found' });
    }

    existingTicket.status = status;

    const updatedTicket = await existingTicket.save();
    res.json(updatedTicket);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}

const allBookingsByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const bookings = await Booking.find({ customer: userId })
        .populate([
            { path: 'customer' },
            { path: 'ticket' },
            { path: 'ride.ride' },
            { path: 'activity.activity' },
            { path: 'schedule', populate: { path: 'slot' } }
        ])
        .sort({ bookingDate: -1 });

        res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

const allBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate([
          { path: 'customer' },
          { path: 'ticket' },
          { path: 'ride.ride' },
          { path: 'activity.activity' },
          { path: 'schedule', populate: { path: 'slot' } }
      ])
      .sort({ bookingDate: -1 });
        res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

const getTicketCount = async(req, res) => {
    try {
        const ticketId = req.params.ticketId;
        const ticketCount = await Ticket.findOne({_id:ticketId});
        res.status(200).json(ticketCount.totalNoOfTickets);
      } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getTicketById = async(req, res) => {
    try {
        const ticketId = req.params.ticketId;
        const ticket = await Ticket.findOne({_id:ticketId});
        res.status(200).json(ticket);
      } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getBookingById = async(req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const booking = await Booking.findOne({_id:bookingId}).populate([
          { path: 'customer' },
          { path: 'ticket' },
          { path: 'ride.ride' },
          { path: 'activity.activity' },
          { path: 'schedule', populate: { path: 'slot' } }
      ]);
        res.status(200).json(booking);
      } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const buyTicket = async(req, res)=>{
    try {
        const { customer, ticket, adultTickets, seniorTickets, childrenTickets, handicappedTickets, totalTickets, totalPrice, ride, activity,status, totalBookingPrice, schedule} = req.body;
  
        const newBooking = new Booking({
            customer, 
            ticket, 
            adultTickets, 
            seniorTickets, 
            childrenTickets, 
            handicappedTickets, 
            totalTickets, 
            totalPrice, 
            ride, 
            activity,
            status,
            totalBookingPrice,
            schedule
        });

        const savedBooking = await newBooking.save();
        const myTicket = await Ticket.findOne({_id:ticket});
        myTicket.totalNoOfTickets -= totalTickets;
        await myTicket.save();
        res.status(200).json(savedBooking);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}

const addRide = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const { ride , totalBookingPrice} = req.body;

        const existingBooking = await Booking.findById(bookingId);

        if (!existingBooking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        existingBooking.ride = ride;
        existingBooking.totalBookingPrice = totalBookingPrice;

        const updatedBooking = await existingBooking.save();
        const myRide = await Stall.findOne({_id: ride.ride});
        myRide.totalTickets -= ride.totalTickets;
        await myRide.save();

        res.json(updatedBooking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const addActivity = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const { activity, totalBookingPrice } = req.body;

        const existingBooking = await Booking.findById(bookingId);

        if (!existingBooking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        if(!existingBooking.activity){
            existingBooking.activity = [activity];
        }
        else{
            existingBooking.activity.push(activity);
        }

        existingBooking.totalBookingPrice = totalBookingPrice;

        const updatedBooking = await existingBooking.save();
        const myActivity = await Stall.findOne({_id: activity.activity});
        myActivity.totalTickets -= activity.totalTickets;
        await myActivity.save();

        res.json(updatedBooking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteRideByBooking = async (req, res) => {
  try {
    const BookingId = req.params.bookingId;
    const stallId = req.params.stallId;
    const bookingToBeDeleted = await Booking.findOne({_id:BookingId});

    if(bookingToBeDeleted.ride){
      const myRide = await  Stall.findOne({_id:stallId});
      var ridePayments = await Payment.find({booking:BookingId, stall:stallId});
      myRide.totalTickets += bookingToBeDeleted.ride.totalTickets;
      for (const ridePayment of ridePayments) {
        ridePayment.paymentStatus = 'Cancelled';
        ridePayment.date = new Date();
        await ridePayment.save();
      };
      await myRide.save();
    }
    
    bookingToBeDeleted.totalBookingPrice -= bookingToBeDeleted.ride.totalPrice;
    bookingToBeDeleted.ride = null;
    await bookingToBeDeleted.save()

    if (!bookingToBeDeleted) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const deleteActivityByBooking = async (req, res) => {
  try {
    const BookingId = req.params.bookingId;
    const activityId = req.params.activityId;

    const bookingToBeDeleted = await Booking.findOne({_id:BookingId});
    if(bookingToBeDeleted.activity){
      const actualActivity = bookingToBeDeleted.activity.find(ele => ele._id == activityId);
      bookingToBeDeleted.activity.remove(actualActivity);
      bookingToBeDeleted.totalBookingPrice -= actualActivity.totalPrice;
      const myActivity = await  Stall.findOne({_id:actualActivity.activity});
      var activityPayments = await Payment.find({booking:BookingId, stall:actualActivity.activity, amount:actualActivity.totalPrice, totalTickets:actualActivity.totalTickets});
      myActivity.totalTickets += actualActivity.totalTickets;
      for (const activityPayment of activityPayments) {
        activityPayment.paymentStatus = 'Cancelled';
        activityPayment.date = new Date();
        await activityPayment.save();
      }
      await myActivity.save();
    }
    
    await bookingToBeDeleted.save()

    if (!bookingToBeDeleted) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const deleteBooking = async (req, res) => {
    try {
      const BookingId = req.params.id;
      const bookingToBeDeleted = await Booking.findOne({_id:BookingId}).populate('customer ticket ride activity');
      var myTicket = await Ticket.findOne({_id:bookingToBeDeleted.ticket});
      var bookingPayment = await Payment.findOne({booking:BookingId});
      // const deletedBooking = await Booking.findByIdAndDelete(BookingId);

      myTicket.totalNoOfTickets += bookingToBeDeleted.totalTickets;
      await myTicket.save();

      if(bookingToBeDeleted.ride){
        const myRide = await  Stall.findOne({_id:bookingToBeDeleted.ride.ride});
        var ridePayment = await Payment.findOne({booking:BookingId, stall:myRide._id});
        myRide.totalTickets += bookingToBeDeleted.ride.totalTickets;
        ridePayment.paymentStatus = 'Cancelled';
        ridePayment.date = new Date();
        await ridePayment.save();
        await myRide.save();
      }

      if(bookingToBeDeleted.activity){
        bookingToBeDeleted.activity.forEach(async activity => {
          var myActivity = await Stall.findOne({_id: activity.activity});
          var activityPayments = await Payment.find({booking:BookingId, stall:activity.activity});
          myActivity.totalTickets += activity.totalTickets;
          for (const activityPayment of activityPayments) {
            activityPayment.paymentStatus = 'Cancelled';
            activityPayment.date = new Date();
            await activityPayment.save();
          }
          await myActivity.save();
        });
      }

      bookingToBeDeleted.status = 'Cancelled';
      bookingPayment.paymentStatus = 'Cancelled';
      bookingPayment.date = new Date();
      await bookingToBeDeleted.save()
      await bookingPayment.save();

      if (!bookingToBeDeleted) {
        return res.status(404).json({ error: 'Book not found' });
      }
  
      res.json({ message: 'Booking deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

module.exports = {
    addTicket,
    allTickets,
    getTicketCount,
    getTicketById,
    buyTicket,
    allBookingsByUser,
    getBookingById,
    addRide,
    addActivity,
    deleteBooking,
    allBookings,
    changeTicketStatus,
    deleteRideByBooking,
    deleteActivityByBooking,
    editTicket
}