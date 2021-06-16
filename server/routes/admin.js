const express = require('express');
const {
  getUsers,
  deleteEvents,
  createEvents,
} = require('../controllers/admin');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.get('/users', protect, getUsers);
router.post('/events', protect, createEvents);
router.delete('/events', protect, deleteEvents);

module.exports = router;
