require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/user.route');
const ticketRouter = require('./routes/ticket.route');
const stallRouter = require('./routes/stall.route');
const paymentRouter = require('./routes/payment.route');

const app = express();
const PORT = process.env.PORT || 8000;

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(express.static("public"));
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use('/api/users', userRouter);
app.use('/api/tickets', ticketRouter);
app.use('/api/stalls', stallRouter);
app.use('/api/payments', paymentRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });