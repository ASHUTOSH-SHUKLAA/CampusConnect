const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const registrationController = require('../controllers/registrationController');
const { authMiddleware, authorizeRoles } = require('../middleware/auth');

// Public routes
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);

// Protected routes (Organizer/Admin)
router.post('/', authMiddleware, authorizeRoles('organizer', 'admin'), eventController.createEvent);
router.put('/:id', authMiddleware, authorizeRoles('organizer', 'admin'), eventController.updateEvent);
router.delete('/:id', authMiddleware, authorizeRoles('organizer', 'admin'), eventController.deleteEvent);
router.get('/:id/attendees', authMiddleware, authorizeRoles('organizer', 'admin'), eventController.getEventAttendees);

// Registration routes for events
router.post('/:id/register', authMiddleware, registrationController.registerForEvent);
router.delete('/:id/register', authMiddleware, registrationController.cancelRegistration);

module.exports = router;
