// routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const { addTicket, editTicket, allTickets, getTicketCount, getTicketById, buyTicket, allBookingsByUser, getBookingById, addRide, addActivity, deleteBooking, allBookings, changeTicketStatus, deleteRideByBooking, deleteActivityByBooking } = require('../controllers/ticket.controller');
const { addSlot, allSlots, addSchedules, allSchedules, activeSchedules } = require('../controllers/schedule.controller');
const verifyToken  = require('../middlewares/auth');

router.use(verifyToken);

router.post('/addTicket', addTicket);
router.put('/editTicket/:ticketId', editTicket);
router.post('/addSlot', addSlot);
router.post('/addSchedules', addSchedules);
router.post('/buyTicket', buyTicket);
router.get('/allTickets', allTickets);
router.get('/allSlots', allSlots);
router.get('/allSchedules', allSchedules);
router.get('/activeSchedules', activeSchedules);
router.get('/allBookings', allBookings);
router.get('/ticketsCount/:ticketId', getTicketCount);
router.put('/changeStatus/:ticketId', changeTicketStatus);
router.get('/:ticketId', getTicketById);
router.delete('/bookings/:id', deleteBooking);
router.delete('/deleteRideByBooking/:bookingId/:stallId', deleteRideByBooking);
router.delete('/deleteActivityByBooking/:bookingId/:activityId', deleteActivityByBooking);
router.get('/bookings/:bookingId', getBookingById);
router.get('/allBookings/:userId', allBookingsByUser);
router.put('/addRide/:bookingId', addRide);
router.put('/addActivity/:bookingId', addActivity);

module.exports = router;
