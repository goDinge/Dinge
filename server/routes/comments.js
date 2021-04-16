const express = require('express');

const { createComment } = require('../controllers/comments');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/:id', protect, createComment);

module.exports = router;
