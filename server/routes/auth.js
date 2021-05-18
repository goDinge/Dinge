const express = require('express');
const {
  registerUser,
  login,
  getAuthUser,
  editAuthUser,
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/', registerUser);
router.post('/login', login);
router.get('/me', protect, getAuthUser);
router.put('/me', protect, editAuthUser);

module.exports = router;
