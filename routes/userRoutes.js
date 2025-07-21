const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.get('/', authenticate, authorize(['admin']), getAllUsers);

module.exports = router;