const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//desc     get all users
//route    GET /api/users/users
//access   Public
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();

  if (!users) {
    return next(new ErrorResponse(`No users found.`));
  }

  res.status(200).json(users);
});
