const express = require('express');
const { getDinge, createDing } = require('../controllers/dinge');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getDinge);
router.post('/', protect, createDing);

module.exports = router;
