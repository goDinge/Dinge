const User = require('../models/User');
const Event = require('../models/Event');
const Comment = require('../models/Comment');
const Ding = require('../models/Ding');
const ErrorResponse = require('../utils/errorResponse');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const asyncHandler = require('../middleware/async');
const sgMail = require('@sendgrid/mail');

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

//desc     UPDATE last login date without Login or Register
//route    PUT /api/auth/lastlogin
//access   Private
exports.lastLogin = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorResponse(`No user found.`));
  }

  user.lastLoginAt = Date.now();
  await user.save();

  res.status(200).json({ success: true, data: user });
});

//desc     EDIT auth user
//route    PUT /api/auth/me
//access   Private
exports.editAuthUser = asyncHandler(async (req, res, next) => {
  const { email, name, website, facebook } = req.body;

  const updateResult = await User.updateOne(
    { _id: req.user.id },
    {
      $set: {
        email,
        name,
        website,
        facebook,
        lastModifiedAt: Date.now(),
      },
    }
  );

  const user = await User.findById(req.user.id);

  res.status(200).json({ success: true, data: { user, updateResult } });
});

//desc     CHANGE password
//route    PUT /api/auth/password
//access   Private
exports.changeAuthPassword = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.user.id).select('+password');

  const { oldPassword, newPassword } = req.body;

  //Check if password matches
  const isMatch = await user.matchPassword(oldPassword);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid password', 401));
  }

  //mongoDB syntax requires bcrypting the password as Model pre save function doesn't apply
  const salt = await bcrypt.genSalt(10);
  const encrypted = await bcrypt.hash(newPassword, salt);

  await User.updateOne(
    { _id: req.user.id },
    {
      $set: {
        password: encrypted,
        lastModifiedAt: Date.now(),
      },
    }
  );

  user = await User.findById(req.user.id);

  res.status(200).json({ success: true, data: user });
});

//desc    GENERATE verification code
//route   POST /api/auth/forgotpassword
//access  public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  //get reset token
  const veriCode = user.getVerificationCode();

  await user.save({ validateBeforeSave: false });

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const mailText = `Here is your 4 digit verification code: <strong>${veriCode}</strong>`;

  try {
    await sgMail.send({
      to: user.email,
      from: 'leonard@getdinge.com',
      subject: 'Dinge - reset',
      html: `<p>Hello ${user.name}, <br><br>
        ${mailText}<br>
        <br>
        Thanks, <br><br>
        Leonard, Dinge<br>
        leonard@getdinge.com
        </p>`,
    });
    //console.log('server veriCode: ', veriCode);
    res.status(200).json({
      success: true,
      data: veriCode,
    });
  } catch (err) {
    user.verificationCode = undefined;
    user.verificationCodeExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse(err.message, 500));
  }
});

//desc    POST verification code
//route   POST /api/auth/forgotpassword/:vericode
//access  public
exports.verificationCode = asyncHandler(async (req, res, next) => {
  //get hashed token
  const verificationCode = crypto
    .createHash('sha256')
    .update(req.params.vericode)
    .digest('hex');

  const user = await User.findOne({
    verificationCode,
    verificationCodeExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid verification code', 400));
  }

  res.status(200).json({
    success: true,
  });
});

//desc    UPDATE password
//route   PUT /api/auth/forgotpassword/:vericode/
//access  public
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const verificationCode = crypto
    .createHash('sha256')
    .update(req.params.vericode)
    .digest('hex');

  const user = await User.findOne({
    verificationCode,
    verificationCodeExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid verification code', 400));
  }
  //mongoose syntax has an User.pre function to encrypt password before saving to DB
  //so no need to bcrypt password here
  const password = req.body.password;

  user.password = password;
  user.lastModifiedAt = Date.now();
  user.verificationCode = undefined;
  user.verificationCodeExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
  });
});

//desc    DELETE authUser
//route   DELETE /api/auth/me
//access  private
exports.deleteAuthUser = asyncHandler(async (req, res, next) => {
  const eventCount = await Event.countDocuments({
    user: req.user.id,
  });
  const eventResult = await Event.deleteMany({
    user: req.user.id,
  });

  if (eventCount !== eventResult.deletedCount) {
    return next(new ErrorResponse('Not all events are deleted', 400));
  }

  const commentCount = await Comment.countDocuments({
    userId: req.user.id,
  });
  const commentResult = await Comment.deleteMany({
    userId: req.user.id,
  });
  if (commentCount !== commentResult.deletedCount) {
    return next(new ErrorResponse('Not all comments are deleted', 400));
  }

  const dingCount = await Ding.countDocuments({
    user: req.user.id,
  });
  const dingResult = await Ding.deleteMany({
    user: req.user.id,
  });
  if (dingCount !== dingResult.deletedCount) {
    return next(new ErrorResponse('Not all dinge are deleted', 400));
  }

  const userResult = await User.deleteOne({ _id: req.user.id });

  if (userResult.deleteCount === 0) {
    return next(new ErrorResponse('User not deleted', 400));
  }

  res.status(200).json({
    success: true,
  });
});

/*** HELPER ***/
const sendTokenResponse = async (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    //httpOnly: true,
  };

  user.lastLoginAt = Date.now();
  await user.save();

  // if (process.env.NODE_ENV === 'production') {
  //   options.secure = true;
  // }

  //where we save token to cookie, with options
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ token, user, options });
};

//Check if password matches IF pw is not encrypted in DB
// if (password !== user.password) {
//   return next(new ErrorResponse('Invalid password', 401));
// }
