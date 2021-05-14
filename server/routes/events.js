const express = require('express');
const {
  createEvent,
  deleteEventById,
  getEvents,
  getEventById,
  getLocalEvents,
} = require('../controllers/events');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getEvents);
router.get('/local/:distance/:location', protect, getLocalEvents);
router.get('/:id', getEventById);
router.post('/', protect, createEvent);
router.delete('/:id', protect, deleteEventById);

module.exports = router;
