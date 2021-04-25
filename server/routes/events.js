const express = require('express');
const { createEvent } = require('../controllers/events');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createEvent);

module.exports = router;
