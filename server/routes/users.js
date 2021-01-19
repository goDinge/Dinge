const express = require('express');
const {
  getUsers,
  getCurrentUser,
  followUser,
  reportUser,
  deleteUserById,
  removeFollower,
} = require('../controllers/users');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.get('/', getUsers);
router.get('/me', protect, getCurrentUser);
router.put('/reports/:id', protect, reportUser);
router.put('/follow/:id', protect, followUser);
router.put('/followers/:id', protect, removeFollower);
router.delete('/:id', deleteUserById);

module.exports = router;
