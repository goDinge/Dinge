const express = require('express');
const {
  registerUser,
  login,
  getAuthUser,
  editAuthUser,
  changeAuthPassword,
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/', registerUser);
router.post('/login', login);
router.get('/me', protect, getAuthUser);
router.put('/me', protect, editAuthUser);
router.put('/password', protect, changeAuthPassword);

module.exports = router;
