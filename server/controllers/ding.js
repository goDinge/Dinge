const Ding = require('../models/Ding');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//desc    ADD user's ID to ding's fav array
//route   PUT /api/ding/:id
//access  private
exports.addFavDing = asyncHandler(async (req, res, next) => {
  const ding = await Ding.findById(req.params.id);
  const userId = req.user.id;

  ding.likes.push(userId);

  res.status(200).json({ success: true, data: ding });
});
