const Ding = require('../models/Ding');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//desc    LIKE Ding
//route   PUT /api/ding/likes/:id
//access  private
exports.likeDing = asyncHandler(async (req, res, next) => {
  const ding = await Ding.findById(req.params.id);
  const userId = req.user.id;

  const dingLikes = ding.likes;

  //dingLikes.push(userId);

  if (!dingLikes.includes(userId)) {
    dingLikes.push(userId);
  } else {
    return next(new ErrorResponse('User has already liked this Ding', 400));
  }

  ding.save();

  res.status(200).json({ success: true, data: ding });
});

//desc    UNLIKE Ding
//route   DELETE /api/ding/:id
//access  private
exports.unlikeDing = asyncHandler(async (req, res, next) => {
  await Ding.updateOne(
    { _id: req.params.id },
    { $pull: { likes: req.user.id } }
  );

  const ding = await Ding.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: ding,
  });
});
