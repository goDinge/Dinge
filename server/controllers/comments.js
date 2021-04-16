const Ding = require('../models/Ding');
const User = require('../models/User');
const Comment = require('../models/Comment');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//desc    CREATE Comment by Ding ID
//route   POST /api/comments/:id/
//access  private
exports.createComment = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const dingId = req.params.id;
  const text = req.body.text;
  const ding = await Ding.findById(dingId);

  if (!ding) {
    return next(
      new ErrorResponse(`No ding with the id of ${req.params.bootcampId}`, 404)
    );
  }

  const comment = await Comment.create({
    user: userId,
    text,
    ding: dingId,
  });

  res.status(200).json({
    success: true,
    data: comment,
  });
});
