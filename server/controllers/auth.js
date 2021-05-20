const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const crypto = require('crypto');
const asyncHandler = require('../middleware/async');

//desc    REGISTER user
//route   POST /api/auth
//access  public
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    return next(
      new ErrorResponse(
        `The email of ${email} already exists on our database.`,
        400
      )
    );
  }

  if (!name || !email || !password) {
    return next(
      new ErrorResponse('Please provide name, email and password', 400)
    );
  }
  user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 200, res);
});

//desc    LOGIN user
//route   POST /api/auth/login
//access  public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  //Check for user
  const user = await User.findOne({ email }).select('+password'); //need to see password for login

  if (!user) {
    return next(new ErrorResponse('Invalid email', 401));
  }

  //Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid password', 401));
  }

  sendTokenResponse(user, 200, res);
});

//desc     GET login user
//route    GET /api/auth/me
//access   Private
exports.getAuthUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse(`No user found.`));
  }

  res.status(200).json({ success: true, data: user });
});

//desc     EDIT auth user
//route    PUT /api/auth/me
//access   Private
exports.editAuthUser = asyncHandler(async (req, res, next) => {
  // if (!user) {
  //   return next(new ErrorResponse(`No user found.`));
  // }

  const { email, name, website, facebook } = req.body;

  console.log(req.body.email);

  await User.updateOne(
    { _id: req.user.id },
    {
      $set: {
        email,
        name,
        website,
        facebook,
      },
    }
  );

  const user = await User.findById(req.user.id);

  res.status(200).json({ success: true, data: user });
});

/*** HELPER ***/
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    //httpOnly: true,
  };

  // if (process.env.NODE_ENV === 'production') {
  //   options.secure = true;
  // }

  //where we save token to cookie, with options
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ token, user, options });
};
