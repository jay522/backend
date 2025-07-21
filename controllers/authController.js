const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../config/jwt');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }

        // Create new user
        const userId = await User.create({ username, email, password });
        
        // Generate JWT token
        const token = jwt.sign({ id: userId }, secret, { expiresIn });

        res.status(201).json({ 
            success: true, 
            message: 'User created successfully', 
            token 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id }, secret, { expiresIn });

        res.json({ 
            success: true, 
            message: 'Logged in successfully', 
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { signup, login, getMe };