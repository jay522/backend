const express = require('express');
const { handler } = require('../middleware/jwtMiddleware');
const router = express.Router();


router.get('/', handler);
module.exports = router;