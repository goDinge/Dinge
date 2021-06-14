const Ding = require('../models/Ding');
const User = require('../models/User');
const Comment = require('../models/Comment');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const repScores = require('../utils/repScores');
const aws = require('aws-sdk');

//desc    LIKE Ding
//route   PUT /api/ding/likes/:id
//access  private
exports.likeDing = asyncHandler(async (req, res, next) => {
  const ding = await Ding.findById(req.params.id);
  const dingUser = await User.findById(ding.user);
  const user = await User.findById(req.user.id);

  const userId = req.user.id;
  const dingLikes = ding.likes;

  if (!dingLikes.includes(userId)) {
    dingLikes.push(userId);
  } else {
    return next(new ErrorResponse('User has already liked this Ding', 400));
  }

  await ding.save();

  if (dingUser.id !== user.id) {
    dingUser.reputation =
      dingUser.reputation + repScores.repScores.likeReceived;
    await dingUser.save();

    user.reputation = user.reputation + repScores.repScores.likeGiven;
    await user.save();
  }

  res.status(200).json({ success: true, data: ding });
});

//desc    UNLIKE Ding
//route   DELETE /api/ding/likes/:id
//access  private
exports.unlikeDing = asyncHandler(async (req, res, next) => {
  await Ding.updateOne(
    { _id: req.params.id },
    { $pull: { likes: req.user.id } }
  );

  const ding = await Ding.findById(req.params.id);
  const dingUser = await User.findById(ding.user);
  const user = await User.findById(req.user.id);

  if (dingUser.id !== user.id) {
    dingUser.reputation =
      dingUser.reputation - repScores.repScores.likeReceived;
    if (dingUser.reputation >= 5) {
      dingUser.level = 'Citizen';
    }
    await dingUser.save();

    user.reputation = user.reputation - repScores.repScores.likeGiven;
    if (user.reputation >= 5) {
      user.level = 'Citizen';
    }
    await user.save();
  }

  res.status(200).json({
    success: true,
    data: ding,
  });
});

//desc    REPORT Ding
//route   PUT /api/ding/reports/:id
//access  private
exports.reportDing = asyncHandler(async (req, res, next) => {
  const ding = await Ding.findById(req.params.id);
  const dingUser = await User.findById(ding.user);
  const user = await User.findById(req.user.id);

  const dingReports = ding.reports;

  if (!dingReports.includes(user.id)) {
    dingReports.push(user.id);
  } else {
    return next(
      new ErrorResponse('You have previously reported this Ding. Thanks.', 400)
    );
  }

  dingUser.reputation =
    dingUser.reputation - repScores.repScores.reportReceived;
  await dingUser.save();

  user.reputation = user.reputation + repScores.repScores.reportGiven;
  await user.save();

  await ding.save();

  res.status(200).json({
    success: true,
    data: 'ding reported',
  });
});

//desc    UNREPORT Ding
//route   DELETE /api/ding/reports/:id
//access  private
exports.unReportDing = asyncHandler(async (req, res, next) => {
  await Ding.updateOne(
    { _id: req.params.id },
    { $pull: { reports: req.user.id } }
  );

  const ding = await Ding.findOne({ _id: req.params.id });
  const dingUser = await User.findById(ding.user);
  const user = await User.findById(req.user.id);

  dingUser.reputation =
    dingUser.reputation + repScores.repScores.reportReceived;
  await dingUser.save();

  user.reputation = user.reputation - repScores.repScores.reportGiven;
  await user.save();

  await ding.save();

  res.status(200).json({
    success: true,
    data: 'ding unreported',
  });
});

//desc    DELETE Ding by ID
//route   DELETE /api/ding/:id
//access  private
exports.deleteDingById = asyncHandler(async (req, res, next) => {
  const ding = await Ding.findOne({ _id: req.params.id });
  const dingUser = await User.findById(ding.user);
  const userId = req.user.id;

  const imgUrl = 'img/' + ding.imgUrl.split('/').pop();
  const thumbUrl = 'thumbnails/' + ding.thumbUrl.split('/').pop();

  const deleteParam = {
    Bucket: process.env.BUCKET_NAME,
    Delete: {
      Objects: [{ Key: imgUrl }, { Key: thumbUrl }],
    },
  };

  if (ding.user.toString() === userId) {
    const s3 = new aws.S3({
      accessKeyId: process.env.ACCESSKEYID,
      secretAccessKey: process.env.SECRETACCESSKEY,
      Bucket: process.env.BUCKET_NAME,
    });

    await s3
      .deleteObjects(deleteParam, (err, data) => {
        if (err) console.error('err: ', err);
        if (data) console.log('data:', data);
      })
      .promise();

    await ding.remove();
    dingUser.reputation = dingUser.reputation - repScores.repScores.uploadDing;
    await dingUser.save();
  } else {
    return next(
      new ErrorResponse('You are not authorized to delete this Ding.', 400)
    );
  }

  await Comment.deleteMany({ dingId: ding });

  const dinge = await Ding.find();

  res.status(200).json({
    success: true,
    data: dinge,
  });
});

//desc    UPDATE Ding's location by ID
//route   PUT /api/ding/:id/:location
//access  private
exports.updateDingLocation = asyncHandler(async (req, res, next) => {
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;

  await Ding.updateOne(
    { _id: req.params.id },
    { $set: { location: { longitude: longitude, latitude: latitude } } }
  );

  const ding = await Ding.findById(req.params.id);

  await ding.save();

  res.status(200).json({ success: true, data: ding });

  // if (userId != ding.user) {
  //   return next(new ErrorResponse('You are not authorized.', 400));
  // }
});

//desc    UPDATE Ding's description by ID
//route   PUT /api/ding/:id
//access  private
exports.updateDingDescription = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const description = req.body.text;
  const ding = await Ding.findById(req.params.id);

  const dingUser = ding.user;

  if (dingUser != userId) {
    return next(
      new ErrorResponse(`You are not authorized to edit this comment.`, 400)
    );
  }

  await Ding.updateOne(
    {
      _id: req.params.id,
    },
    {
      $set: {
        description,
        lastModifiedAt: Date.now(),
      },
    }
  );

  const editedDing = await Ding.findById(req.params.id);
  console.log('controllers ding: ', editedDing.description);

  res.status(200).json({
    success: true,
    data: editedDing.description,
  });
});
