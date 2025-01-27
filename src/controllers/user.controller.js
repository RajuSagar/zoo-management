const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const Admin = require('../models/admin.model');
const Customer = require('../models/customer.model');

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user =  req.myUser == 'Admin' ? await Admin.findOne({ email }) : await Customer.findOne({ email });

        if (!user) {
        return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);


        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = await user.generateAuthToken();

        const currentUser = req.myUser == 'Admin' ? await Admin.findById(user._id).select("-password") : await Customer.findById(user._id).select("-password");

        return res
        .status(200)
        .cookie("accessToken", token, { secure: true})
        .json({ currentUser,token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existedUser = req.myUser == 'Admin' ? await Admin.findOne({email}) : await Customer.findOne({email})
        if (existedUser) {
            return res.status(401).json({ error: 'User already exists' });
        }
        const newUser = req.myUser == 'Admin' ? new Admin({ name, email, password }) : new Customer({ name, email, password });
        const user = await newUser.save();

        const token = await user.generateAuthToken();


        if(req.myUser == 'Customer'){
            return res
            .status(200)
            .cookie("accessToken", token, { secure: true})
            .json({ user,token });
        }
        else{
            return res.status(200).json({ message: 'Admin registered successfully' });
        }
        } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const logoutUser = async (req, res) => {
    return res
    .clearCookie('accessToken')
    .json({ message: 'Logout successful' });
}

const getCurrentUser = async (req, res) => {
    return res
    .status(200)
    .json({data: req.user})
}

const testUser = async(req,res) => {
    return res.
    status(200)
    .json({ message: 'user route successfull' });
}

module.exports = {
    loginUser,
    registerUser,
    logoutUser,
    getCurrentUser,
    testUser
}