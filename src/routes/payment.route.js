const express = require('express');
const router = express.Router();
const { addPayment, cancelledPaymentsByCustomer, cancelledPayments } = require('../controllers/payment.controller');
const verifyToken  = require('../middlewares/auth');

router.use(verifyToken);

router.post('/addPayment', addPayment);
router.get('/cancelledPaymentsByCustomer/:customerId', cancelledPaymentsByCustomer);
router.get('/cancelledPayments', cancelledPayments);
// router.get('/getTicketsCount/:stallId', getStallTicketsCount);
// router.get('/:stallId', getStallById);

module.exports = router;
