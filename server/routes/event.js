const express = require('express');
const multer = require('multer');
const {
  updateEvent,
  likeEvent,
  unlikeEvent,
  reportEvent,
  unReportEvent,
  updateEventLocation,
} = require('../controllers/event');

const { protect } = require('../middleware/auth');

const multerSingle = multer({
  dest: 'uploads/',
  //limits: { fieldSize: 300 * 300 },
}).single('eventPic');

const router = express.Router();

router.put('/:id', protect, multerSingle, updateEvent);
router.put('/likes/:id', protect, likeEvent);
router.delete('/likes/:id', protect, unlikeEvent);
router.put('/reports/:id', protect, reportEvent);
router.delete('/reports/:id', protect, unReportEvent);
//router.delete('/:id', protect, deleteEventById);
router.put('/:id/:location', protect, updateEventLocation);

module.exports = router;
