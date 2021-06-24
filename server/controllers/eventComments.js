const Event = require('../models/Event');
const User = require('../models/User');
const EventComment = require('../models/EventComment');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const repScores = require('../utils/repScores');

//desc    CREATE Event Comment by Event ID
//route   POST /api/eventcomments/:id/
//access  private
exports.createEventComment = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const eventId = req.params.id;
  const text = req.body.text;
  const event = await Event.findById(eventId);
  const user = await User.findById(userId);

  const userName = user.name;

  if (!event) {
    return next(
      new ErrorResponse(`No event with the id of ${req.params.id}`, 404)
    );
  }

  const comment = await EventComment.create({
    userId,
    userName,
    text,
    eventId,
  });

  event.comments.unshift(comment._id);
  event.save();

  res.status(200).json({
    success: true,
    data: comment,
  });
});

//desc    EDIT Comment by comment ID
//route   PUT /api/eventcomments/:id/
//access  private
exports.editEventCommentById = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const text = req.body.text;
  const comment = await EventComment.findById(req.params.id);

  const commentUser = comment.userId;

  if (commentUser != userId) {
    return next(
      new ErrorResponse(`You are not authorized to edit this comment.`, 400)
    );
  }

  await EventComment.updateOne(
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

  const editedComment = await EventComment.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: editedComment,
  });
});

//desc    GET Comment by Comment ID
//route   GET /api/eventcomments/:id/
//access  private
exports.getEventCommentById = asyncHandler(async (req, res, next) => {
  const comment = await EventComment.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: comment,
  });
});

//desc    LIKE Comment by ID
//route   PUT /api/eventcomments/likes/:id
//access  private
exports.likeEventCommentById = asyncHandler(async (req, res, next) => {
  const comment = await EventComment.findById(req.params.id);
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
//route   DELETE /api/eventcomments/likes/:id
//access  private
exports.unlikeEventCommentById = asyncHandler(async (req, res, next) => {
  await EventComment.updateOne(
    { _id: req.params.id },
    { $pull: { likes: req.user.id } }
  );

  const comment = await EventComment.findById(req.params.id);
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
//route   PUT /api/eventcomments/reports/:id
//access  private
exports.reportEventCommentById = asyncHandler(async (req, res, next) => {
  const comment = await EventComment.findById(req.params.id);
  const commentUser = await User.findById(comment.userId);
  const user = await User.findById(req.user.id);

  const commentReports = comment.reports;

  if (!commentReports.includes(user.id)) {
    commentReports.push(user.id);
  } else {
    res.status(400).send('You have previously reported this comment. Thanks.');
    return;
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
//route   DELETE /api/eventcomments/reports/:id
//access  private
exports.unReportEventCommentById = asyncHandler(async (req, res, next) => {
  await EventComment.updateOne(
    { _id: req.params.id },
    { $pull: { reports: req.user.id } }
  );

  const comment = await EventComment.findOne({ _id: req.params.id });
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
//route   DELETE /api/eventcomments/:commentid/:eventid
//access  private
exports.deleteEventCommentById = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const comment = await EventComment.findById(req.params.commentid);

  const commentUser = comment.userId;

  if (commentUser != userId) {
    return next(
      new ErrorResponse(`You are not authorized to delete this comment.`, 400)
    );
  }

  await EventComment.findByIdAndRemove(req.params.commentid);
  await Event.updateOne(
    { _id: req.params.eventid },
    { $pull: { comments: req.params.commentid } }
  );

  res.status(200).json({
    success: true,
  });
});
