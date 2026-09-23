const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { authMiddleware } = require('../middleware/auth');

router.get('/me', authMiddleware, registrationController.getMyRegistrations);

module.exports = router;
