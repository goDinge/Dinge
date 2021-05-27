const Ding = require('../models/Ding');
const User = require('../models/User');
const Comment = require('../models/Comment');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const repScores = require('../utils/repScores');

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
    data: comment,
  });
});

//desc    EDIT Comment by comment ID
//route   PUT /api/comments/:id/
//access  private
exports.editCommentById = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const text = req.body.text;
  const comment = await Comment.findById(req.params.id);

  const commentUser = comment.userId;

  if (commentUser != userId) {
    return next(
      new ErrorResponse(`You are not authorized to edit this comment.`, 400)
    );
  }

  await Comment.updateOne(
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

//desc    LIKE Comment by ID
//route   PUT /api/comments/likes/:id
//access  private
exports.likeCommentById = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  const commentUser = await User.findById(comment.userId); //should be just 'user' in Comment model
  const user = await User.findById(req.user.id);

  const userId = req.user.id;
  const commentLikes = comment.likes;

  if (!commentLikes.includes(userId)) {
    commentLikes.push(userId);
  } else {
    return next(new ErrorResponse('User has already liked this comment', 400));
  }

  await comment.save();

  if (commentUser.id !== user.id) {
    commentUser.reputation =
      commentUser.reputation + repScores.repScores.likeReceived;

    await commentUser.save();

    user.reputation = user.reputation + repScores.repScores.likeGiven;
    await user.save();
  }

  res.status(200).json({ success: true, data: comment });
});

//desc    UNLIKE Comment
//route   DELETE /api/comments/likes/:id
//access  private
exports.unlikeCommentById = asyncHandler(async (req, res, next) => {
  await Comment.updateOne(
    { _id: req.params.id },
    { $pull: { likes: req.user.id } }
  );

  const comment = await Comment.findById(req.params.id);
  const commentUser = await User.findById(comment.userId);
  const user = await User.findById(req.user.id);

  if (commentUser.id !== user.id) {
    commentUser.reputation =
      commentUser.reputation - repScores.repScores.likeReceived;

    await commentUser.save();

    user.reputation = user.reputation - repScores.repScores.likeGiven;

    await user.save();
  }

  res.status(200).json({
    success: true,
    data: comment,
  });
});

//desc    REPORT Comment
//route   PUT /api/comments/reports/:id
//access  private
exports.reportCommentById = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  const commentUser = await User.findById(comment.userId);
  const user = await User.findById(req.user.id);

  const commentReports = comment.reports;

  if (!commentReports.includes(user.id)) {
    commentReports.push(user.id);
  } else {
    return next(
      new ErrorResponse('User has already reported this Comment', 400)
    );
  }

  commentUser.reputation =
    commentUser.reputation - repScores.repScores.reportReceived;
  await commentUser.save();

  user.reputation = user.reputation + repScores.repScores.reportGiven;
  await user.save();

  await comment.save();

  res.status(200).json({
    success: true,
    data: comment,
  });
});

//desc    UNREPORT Comment
//route   DELETE /api/comments/reports/:id
//access  private
exports.unReportCommentById = asyncHandler(async (req, res, next) => {
  await Comment.updateOne(
    { _id: req.params.id },
    { $pull: { reports: req.user.id } }
  );

  const comment = await Comment.findOne({ _id: req.params.id });
  const commentUser = await User.findById(comment.userId);
  const user = await User.findById(req.user.id);

  commentUser.reputation =
    commentUser.reputation + repScores.repScores.reportReceived;
  await commentUser.save();

  user.reputation = user.reputation - repScores.repScores.reportGiven;
  await user.save();

  await comment.save();

  res.status(200).json({
    success: true,
    data: comment,
  });
});

//desc    DELETE Comment by Comment ID
//route   DELETE /api/comments/:id/
//access  private
exports.deleteCommentById = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const comment = await Comment.findById(req.params.id);

  const commentUser = comment.userId;

  if (commentUser != userId) {
    return next(
      new ErrorResponse(`You are not authorized to delete this comment.`, 400)
    );
  }

  await Comment.findByIdAndRemove(req.params.id);

  res.status(200).json({
    success: true,
  });
});
