const fs = require('fs');
const User = require('../models/User');
const Ding = require('../models/Ding');
const Comment = require('../models/Comment');
const Event = require('../models/Event');
const EventComment = require('../models/EventComment');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const aws = require('aws-sdk');
const repScores = require('../utils/repScores');

//desc     get all users
//route    GET /api/users
//access   Public
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();

  if (!users) {
    return next(new ErrorResponse(`No users found.`));
  }

  res.status(200).json(users);
});

//desc     GET user by user ID
//route    GET /api/users/:id
//access   Public
exports.getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`No user found.`));
  }

  res.status(200).json({ success: true, data: user });
});

//desc     UPDATE loggedin user Avatar
//route    PUT /api/users/me
//access   Private
exports.updateCurrentUserAvatar = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const avatar = req.file;

  if (!user) {
    return next(new ErrorResponse(`No user found.`));
  }

  if (!avatar) {
    return next(new ErrorResponse(`No avatar found.`));
  }

  const oldAvatar = 'avatar/' + user.avatar.split('/').pop();
  let newAvatarUrl;

  aws.config.setPromisesDependency();
  aws.config.update({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    region: process.env.REGION,
  });

  const s3 = new aws.S3();

  const uploadAWSImage = async (avatar) => {
    let params = {
      ACL: 'public-read',
      Bucket: process.env.BUCKET_NAME,
      Body: fs.createReadStream(avatar.path),
      Key: `avatar/${avatar.originalname}`,
    };
    await s3.upload(params, async (err, data) => {
      if (err) {
        res.json({ msg: err });
      }

      fs.unlinkSync(avatar.path);

      if (data) {
        newAvatarUrl = data.Location;
        console.log(
          `Image has been uploaded to S3 successfully at ${newAvatarUrl}`
        );

        user.avatar = newAvatarUrl;
        user.lastModifiedAt = Date.now();

        await user.save();

        res.status(200).json({ success: true, data: user });
      }
    });
  };

  const deleteAWSImage = async (oldAvatar) => {
    const deleteParam = {
      Bucket: process.env.BUCKET_NAME,
      Key: oldAvatar,
    };

    await s3
      .deleteObject(deleteParam, (err, data) => {
        if (err) console.error('err: ', err);
        if (data) console.log('data:', data);
      })
      .promise();
  };

  await uploadAWSImage(avatar);
  await deleteAWSImage(oldAvatar);
});

//desc     ADD follow user
//route    PUT /api/users/follow/:id
//access   Private
exports.followUser = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const userToFollowId = req.params.id;

  if (!userToFollowId) {
    return next(new ErrorResponse(`User ID of ${req.params.id} not found.`));
  }

  const user = await User.findById(userId);
  const userToFollow = await User.findById(userToFollowId);

  user.following.push(userToFollowId);
  userToFollow.followers.push(userId);

  user.save();
  userToFollow.save();

  res.status(200).json({ success: true, data: user });
});

//desc     REMOVE follower
//route    PUT /api/users/followers/:id
//access   Private
exports.removeFollower = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const followerToRemoveId = req.params.id;

  if (!followerToRemoveId) {
    return next(new ErrorResponse(`User ID of ${req.params.id} not found.`));
  }

  const user = await User.findById(userId);
  const followerToRemove = await User.findById(followerToRemoveId);

  user.followers.splice(
    user.followers.indexOf((follower) => follower === followerToRemoveId),
    1
  );

  followerToRemove.following.splice(
    followerToRemove.following.indexOf((follow) => follow === userId),
    1
  );

  user.save();

  res.status(200).json({
    success: true,
    data: user,
  });
});

//desc     REPORT user by ID
//route    PUT /api/users/report/:id
//access   Private
exports.reportUser = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const reportedUserId = req.params.id;

  const reportedUser = await User.findById(reportedUserId);

  reportedUser.reports.push(userId);

  reportedUser.save();

  res.status(200).json({
    success: true,
    data: reportedUser,
  });
});

//desc     DELETE user by ID
//route    DELETE /api/users/:id
//access   Public // should be made to admin only
exports.deleteUserById = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  if (!userId) {
    return next(new ErrorResponse(`User ID of ${req.params.id} not found.`));
  }

  //delete this userID from other users' followers array
  const user = await User.findById(userId);
  const followingIds = user.following;

  const users = await User.find({ _id: { $in: followingIds } });

  users.forEach((user) => {
    user.followers.splice(
      user.followers.indexOf((follower) => follower === userId),
      1
    ),
      user.save();
  });

  //cascade delete
  await User.findByIdAndDelete(user);
  await Ding.deleteMany({ user });
  await Event.deleteMany({ user });
  await Comment.deleteMany({ user });
  await EventComment.deleteMany({ user });

  res.status(200).json({
    success: true,
    data: user,
  });
});

//desc     UPDATE reputation
//route    PUT /api/users/:id/:score
//access   Private
exports.updateRepById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const score = req.params.score;

  user.reputation = user.reputation + score;
  user.save();

  res.status(200).json({
    success: true,
    data: user,
  });
});
