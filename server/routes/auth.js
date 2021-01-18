const express = require('express');
const { registerUser, login } = require('../controllers/auth');

const router = express.Router();

router.post('/', registerUser);
router.post('/login', login);

module.exports = router;
