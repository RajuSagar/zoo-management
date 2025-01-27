const jwt = require('jsonwebtoken');
const Customer = require('../models/customer.model');
const Admin = require('../models/admin.model');

const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        const decodedData = jwt.verify(token, process.env.SECRET_KEY);
        var admin = await Admin.findById(decodedData._id).select("-password");
        var customer = await Customer.findById(decodedData._id).select("-password");
        var user;

        if (admin){
            user = {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                is_admin: true
            };
        }
        else{
            user = {
                _id: customer._id,
                name: customer.name,
                email: customer.email,
                is_admin: false
            };
        }
        if (!admin && !customer) {
            throw new Error("Invalid Access Token")
        }
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Authentication failed' });
    }
};

module.exports = verifyToken;