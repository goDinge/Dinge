const express = require('express');
const {
  getUsers,
  getCurrentUser,
  followUser,
  deleteUserById,
} = require('../controllers/users');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.get('/', getUsers);
router.get('/me', protect, getCurrentUser);
router.put('/follow/:id', protect, followUser);
router.delete('/:id', deleteUserById);

module.exports = router;
