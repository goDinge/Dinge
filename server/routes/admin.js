const express = require('express');
const {
  getUsers,
  deleteEvents,
  deleteEventPics,
} = require('../controllers/admin');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.get('/users', protect, getUsers);
router.delete('/events', protect, deleteEvents);
router.delete('/events', protect, deleteEventPics);

module.exports = router;
