const express = require('express');

const {
  createEventComment,
  editEventCommentById,
  getEventCommentById,
  deleteEventCommentById,
  likeEventCommentById,
  unlikeEventCommentById,
  reportEventCommentById,
  unReportEventCommentById,
} = require('../controllers/eventComments');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/:id', protect, createEventComment);
router.put('/:id', protect, editEventCommentById);
router.get('/:id', protect, getEventCommentById);
router.put('/likes/:id', protect, likeEventCommentById);
router.delete('/likes/:id', protect, unlikeEventCommentById);
router.put('/reports/:id', protect, reportEventCommentById);
router.delete('/reports/:id', protect, unReportEventCommentById);
router.delete('/:commentid/:eventid', protect, deleteEventCommentById);

module.exports = router;
