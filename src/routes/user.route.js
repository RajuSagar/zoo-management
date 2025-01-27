const express = require('express');
const router = express.Router();
const { loginUser, registerUser, logoutUser, getCurrentUser } = require('../controllers/user.controller');
const verifyToken  = require('../middlewares/auth');

// User routes
router.post('/adminRegister', ((req,res,next)=>{req.myUser = 'Admin'; next();}), registerUser);
router.post('/customerRegister', ((req,res,next)=>{req.myUser = 'Customer'; next();}), registerUser);
router.post('/AdminLogin',((req,res,next)=>{req.myUser = 'Admin'; next();}), loginUser);
router.post('/CustomerLogin',((req,res,next)=>{req.myUser = 'Customer'; next();}), loginUser);
router.post('/logout', verifyToken, logoutUser);
router.get('/current-user',verifyToken, getCurrentUser);
module.exports = router;
