const express = require('express');

const {
  createComment,
  editComment,
  getCommentById,
} = require('../controllers/comments');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/:id', protect, createComment);
router.put('/:id', protect, editComment);
router.get('/:id', protect, getCommentById);

module.exports = router;
