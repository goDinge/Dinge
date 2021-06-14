const express = require('express');
const multer = require('multer');
const { getUsers } = require('../controllers/users');

const router = express.Router();

const { protect } = require('../middleware/auth');

const multerSingle = multer({
  dest: 'uploads/',
  //limits: { fieldSize: 300 * 300 },
}).single('avatar');

router.get('/users', getUsers);

module.exports = router;
