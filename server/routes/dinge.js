const express = require('express');
const {
  getDinge,
  createDing,
  reportDing,
  deleteDingById,
} = require('../controllers/dinge');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getDinge);
router.post('/', protect, createDing);
router.put('/reports/:id', protect, reportDing);
router.delete('/:id', deleteDingById);

module.exports = router;
