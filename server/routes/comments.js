const express = require('express');

const {
  createComment,
  editCommentById,
  getCommentById,
  deleteCommentById,
  likeCommentById,
  unlikeCommentById,
  reportCommentById,
  unReportCommentById,
} = require('../controllers/comments');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/:id', protect, createComment);
router.put('/:id', protect, editCommentById);
router.get('/:id', protect, getCommentById);
router.delete('/:id', protect, deleteCommentById);
router.put('/likes/:id', protect, likeCommentById);
router.delete('/likes/:id', protect, unlikeCommentById);
router.put('/reports/:id', protect, reportCommentById);
router.delete('/reports/:id', protect, unReportCommentById);

module.exports = router;
