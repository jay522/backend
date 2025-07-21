const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.get('/test', (req, res) => {
  // This is just a test route to check if the server is running
  console.log("checking")
  res.status(200).json({ message: 'Auth route is working!' });
});
module.exports = router;