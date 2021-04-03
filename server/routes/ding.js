const express = require('express');
const { addFavDing } = require('../controllers/ding');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.put('/fav/:id', protect, addFavDing);

module.exports = router;
