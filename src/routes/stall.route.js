const express = require('express');
const router = express.Router();
const { addStall, allStalls, getStallById, getStallTicketsCount, editStall, editStallStatus } = require('../controllers/stall.controller');
const verifyToken  = require('../middlewares/auth');
const upload = require('../middlewares/multer');

router.use(verifyToken);

router.post('/addStall', upload.single("image"), addStall);
router.get('/allStalls', allStalls);
router.get('/getTicketsCount/:stallId', getStallTicketsCount);
router.get('/:stallId', getStallById);
router.put('/:stallId', editStall);
router.put('/editStallStatus/:stallId', editStallStatus);

module.exports = router;
