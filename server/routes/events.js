const express = require('express');
const {
  createEvent,
  deleteEventById,
  getEvents,
  getEventById,
  getEventsByUserId,
  getActiveEventsByUserId,
  getEventsByAuthUser,
  getActiveEventsByAuthUser,
  getLocalEvents,
} = require('../controllers/events');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getEvents);
router.get('/authuser', protect, getEventsByAuthUser);
router.get('/authuser/active', protect, getActiveEventsByAuthUser);
router.get('/local/:distance/:location', protect, getLocalEvents);
router.get('/:id', getEventById);
router.get('/user/:id', protect, getEventsByUserId);
router.get('/user/active/:id', protect, getActiveEventsByUserId);
router.post('/', protect, createEvent);
router.delete('/:id', protect, deleteEventById);

module.exports = router;
