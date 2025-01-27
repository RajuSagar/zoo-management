const mongoose = require('mongoose');
const Admin = require('./models/admin.model');
const Customer = require('./models/customer.model');
const Schedule = require('./models/schedule.model');
const TimeSlot = require('./models/timeSlot.model');
const Payment = require('./models/payment.model');
const Ticket = require('./models/ticket.model');
const Stall = require('./models/stall.model');
const Booking = require('./models/booking.model');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/zoomanagement')
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

const admin = {
    name: 'Admin',
    email: 'admin@gmail.com',
    password: 'admin',
};

const customer = {
    name: 'User',
    email: 'user@gmail.com',
    password: 'user', 
};

const timeSlot = [
  {
    slot: '9am - 12pm'
  },
  {
    slot: '3pm - 7pm'
  }
];

const ticket = {
  name: 'Zoo Entry',
  priceForAdult: 15,
  priceForChildren: 10,
  priceForSenior: 7.5,
  priceForHandicapped: 5,
  totalNoOfTickets: 25,
  status:'Active'
};

const stalls = [
  {
    name: 'Safari Ride',
    stallType: 'Ride',
    price: 12,
    image: 'safari_ride.jpg',
    totalTickets: 10,
    description: 'This is a Bus ride which covers all the zoo area.'
  },
  {
    name: 'Magic Show',
    stallType: 'Activity',
    price: 8,
    image: 'magic_show.jpg',
    totalTickets: 15,
    description: 'This is an amazing magic show with snacks provided.'
  },
  {
    name: 'Kids Play Area',
    stallType: 'Activity',
    price: 15,
    image: 'kids_area.jpg',
    totalTickets: 20,
    description: 'This activity contains small games for kids.'
  }
];


async function insertData() {
  try {
    await Admin.create(admin);
    await Customer.create(customer);
    const savedSlots = await TimeSlot.insertMany(timeSlot);
    for (const element of savedSlots) {
      await Schedule.create({ date: new Date('2024-05-20'), slot: element });
    }
    
    await Stall.insertMany(stalls);
    await Ticket.create(ticket);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

insertData();
