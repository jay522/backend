const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt');
const User = require('../models/userModel');

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error('Authentication required');
        }

        const decoded = jwt.verify(token, secret);
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new Error('User not found');
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
};

const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }
        next();
    };
};

module.exports = { authenticate, authorize };