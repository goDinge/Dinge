const User = require('../models/User');
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

//desc     EDIT auth user
//route    PUT /api/auth/me
//access   Private
exports.editAuthUser = asyncHandler(async (req, res, next) => {
  const { email, name, website, facebook } = req.body;

  await User.updateOne(
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

  res.status(200).json({ success: true, data: user });
});

//desc     CHANGE password
//route    PUT /api/auth/password
//access   Private
exports.changeAuthPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  const { oldPassword, newPassword } = req.body;

  //Check if password matches
  const isMatch = await user.matchPassword(oldPassword);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid password', 401));
  }

  //mongoDB syntax requires bcrypting the password
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

  res.status(200).json({ success: true });
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
      from: 'info@uvstudio.ca',
      subject: 'Dinge - reset',
      html: `<p>Hello ${user.name}, <br><br>
        ${mailText}<br>
        <br>
        Thanks, <br><br>
        Leonard, Dinge<br>
        leonard.shen@gmail.com
        </p>`,
    });
    console.log('server veriCode: ', veriCode);
    res.status(200).json({
      success: true,
      data: veriCode,
    });
  } catch (err) {
    user.verificationCode = undefined;
    user.verificationCodeExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
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
  console.log('update pw 1');
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
  console.log('update pw 2');
  //mongoose syntax has an User.pre function to encrypt password before saving to DB
  //so no need to bcrypt password here
  const password = req.body.password;

  user.password = password;
  user.lastModifiedAt = Date.now();
  user.verificationCode = undefined;
  user.verificationCodeExpire = undefined;
  await user.save();
  console.log('update pw 3');
  res.status(200).json({
    success: true,
  });
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

//Check if password matches IF pw is not encrypted in DB
// if (password !== user.password) {
//   return next(new ErrorResponse('Invalid password', 401));
// }
