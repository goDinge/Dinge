const express = require('express');
const {
  likeDing,
  unlikeDing,
  deleteDingById,
  reportDing,
  unReportDing,
  updateDingLocation,
  updateDingDescription,
} = require('../controllers/ding');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.put('/:id', protect, updateDingDescription);
router.put('/likes/:id', protect, likeDing);
router.put('/reports/:id', protect, reportDing);
router.put('/:id/:location/', protect, updateDingLocation);
router.delete('/reports/:id', protect, unReportDing);
router.delete('/likes/:id', protect, unlikeDing);
router.delete('/:id', protect, deleteDingById);

module.exports = router;
