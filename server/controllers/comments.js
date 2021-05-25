const Ding = require('../models/Ding');
const Comment = require('../models/Comment');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//desc    CREATE Comment by Ding ID
//route   POST /api/comments/:dingid/
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

//desc    EDIT Comment by Ding ID
//route   PUT /api/comments/:commentid/
//access  private
exports.editComment = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const text = req.body.text;
  const comment = await Comment.findById(req.params.id);

  const commentUser = comment.userId;

  if (commentUser != userId) {
    return next(
      new ErrorResponse(`You are not authorized to edit this comment.`, 400)
    );
  }

  const updateResult = await Comment.updateOne(
    {
      _id: req.params.id,
    },
    {
      $set: {
        text,
        lastModifiedAt: Date.now(),
      },
    }
  );

  const editedComment = await Comment.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: editedComment,
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
