const express = require('express');
const { registerUser, login, getAuthUser } = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/', registerUser);
router.post('/login', login);
router.get('/me', protect, getAuthUser);

module.exports = router;
