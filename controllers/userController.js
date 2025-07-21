const User = require('../models/userModel');

const getAllUsers = async (req, res) => {
    try {
        const pool = require('../config/db');
        const [users] = await pool.query('SELECT id, username, email, role FROM users');
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllUsers };