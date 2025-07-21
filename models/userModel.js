const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    static async create({ username, email, password, role = 'user' }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, role]
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await pool.query('SELECT id, username, email, role FROM users WHERE id = ?', [id]);
        return rows[0];
    }
}

module.exports = User;