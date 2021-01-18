const User = require('../models/User');
const Ding = require('../models/Ding');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

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

//desc     GET login user
//route    GET /api/users/me
//access   Private
exports.getCurrentUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse(`No user found.`));
  }

  res.status(200).json({ success: true, data: user });
});

//desc     ADD follow user
//route    PUT /api/users/follow/:id
//access   Private
exports.followUser = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const userToFollowId = req.params.id;

  if (!userToFollowId) {
    return next(new ErrorResponse(`User ID of ${req.body.id} not found.`));
  }

  const user = await User.findById(userId);
  const userToFollow = await User.findById(userToFollowId);

  user.following.push(userToFollowId);
  userToFollow.followers.push(userId);

  user.save();
  userToFollow.save();

  res.status(200).json({ success: true, data: user });
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

  users.forEach((user) =>
    user.followers.splice(
      user.followers.indexOf((follower) => follower === userId),
      1
    )
  );

  console.log(users);

  // const followingUsers = [];
  // followingIds.map(async (id) => {
  //   let user = await User.findById(id);
  //   await followingUsers.push(user);
  // });
  // console.log(followingUsers);

  // await User.findByIdAndDelete(user);
  // await Ding.deleteMany({ user });

  res.status(200).json({
    success: true,
    data: user,
  });
});
