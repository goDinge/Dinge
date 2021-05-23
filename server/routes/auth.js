const express = require('express');
const {
  registerUser,
  login,
  getAuthUser,
  editAuthUser,
  changeAuthPassword,
  forgotPassword,
  verificationCode,
  updatePassword,
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/', registerUser);
router.post('/login', login);
router.get('/me', protect, getAuthUser);
router.put('/me', protect, editAuthUser);
router.put('/password', protect, changeAuthPassword);
router.post('/forgotpassword', forgotPassword);
router.post('/forgotpassword/:vericode', verificationCode);
router.put('/forgotpassword/:vericode', updatePassword);

module.exports = router;
