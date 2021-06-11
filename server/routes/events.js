const express = require('express');
const multer = require('multer');
const {
  createEvent,
  deleteEventById,
  getEvents,
  getEventById,
  getEventsByAuthUser,
  getLocalEvents,
} = require('../controllers/events');

const { protect } = require('../middleware/auth');

const multerSingle = multer({
  dest: 'uploads/',
  //limits: { fieldSize: 300 * 300 },
}).single('eventPic');

const router = express.Router();

router.get('/', protect, getEvents);
router.get('/authuser', protect, getEventsByAuthUser);
router.get('/local/:distance/:location', protect, getLocalEvents);
router.get('/:id', getEventById);
router.post('/', protect, multerSingle, createEvent);
router.delete('/:id', protect, deleteEventById);

module.exports = router;
