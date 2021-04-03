const express = require('express');
const { likeDing, unlikeDing } = require('../controllers/ding');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.put('/likes/:id', protect, likeDing);
router.delete('/likes/:id', protect, unlikeDing);

module.exports = router;
