const express = require('express');
const multer = require('multer');
const {
  getDinge,
  getLocalDinge,
  getDing,
  createDing,
  reportDing,
} = require('../controllers/dinge');

const { protect } = require('../middleware/auth');

const multerMultiple = multer({
  dest: 'temp/',
  limits: { fieldSize: 8 * 1024 * 1024 },
}).array('img');

const router = express.Router();

router.get('/', getDinge);
router.get('/local/:distance/:location', protect, getLocalDinge);
router.get('/:id', getDing);
router.post('/', protect, multerMultiple, createDing);
router.put('/reports/:id', protect, reportDing);

module.exports = router;
