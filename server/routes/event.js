const express = require('express');
const {
  likeEvent,
  unlikeEvent,
  reportEvent,
  unReportEvent,
  deleteEventById,
  updateEventLocation,
} = require('../controllers/event');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.put('/likes/:id', protect, likeEvent);
router.delete('/likes/:id', protect, unlikeEvent);
router.put('/reports/:id', protect, reportEvent);
router.delete('/reports/:id', protect, unReportEvent);
router.delete('/:id', protect, deleteEventById);
router.put('/:id/:location', protect, updateEventLocation);

module.exports = router;
