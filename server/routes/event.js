const express = require('express');
const { updateEventLocation } = require('../controllers/event');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.put('/:id/:location/', protect, updateEventLocation);

module.exports = router;
