const express = require('express');
const multer = require('multer');
const {
  getUsers,
  getUserById,
  updateRepById,
  updateCurrentUserAvatar,
  followUser,
  reportUser,
  deleteUserById,
  removeFollower,
} = require('../controllers/users');

const router = express.Router();

const { protect } = require('../middleware/auth');

const multerSingle = multer({
  dest: 'uploads/',
  //limits: { fieldSize: 300 * 300 },
}).single('avatar');

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id/:score', protect, updateRepById);
router.put('/me', protect, multerSingle, updateCurrentUserAvatar);
router.put('/reports/:id', protect, reportUser);
router.put('/follow/:id', protect, followUser);
router.put('/followers/:id', protect, removeFollower);
router.delete('/:id', deleteUserById);

module.exports = router;
