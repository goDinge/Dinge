const Ding = require('../models/Ding');
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
  const user = await User.findById(userId);

  const userName = user.name;

  if (!ding) {
    return next(
      new ErrorResponse(`No ding with the id of ${req.params.bootcampId}`, 404)
    );
  }

  const comment = await Comment.create({
    userId,
    userName,
    text,
    dingId,
  });

  ding.comments.unshift(comment._id);
  ding.save();

  res.status(200).json({
    success: true,
    data: ding,
  });
});

//desc    GET Comment by Comment ID
//route   GET /api/comments/:id/
//access  private
exports.getCommentById = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: comment,
  });
});
