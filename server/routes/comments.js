const express = require('express');

const { createComment, getCommentById } = require('../controllers/comments');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/:id', protect, createComment);
router.get('/:id', protect, getCommentById);

module.exports = router;
