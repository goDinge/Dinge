const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const errorResponse = require('../utils/errorResponse');
const User = require('../models/User');

//Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.token || req.headers.authorization;

  // console.log('middleware auth token: ', token);
  // console.log('middleware auth req.headers: ', req.headers.authorization);
  // console.log('middleware auth req.cookies: ', req.cookies);

  //Make sure token is sent
  if (!token) {
    return next(
      new errorResponse('Not authorized to access this route - no token', 401)
    );
  }

  try {
    //Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('auth: verify token decoded: ', decoded);

    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    return next(
      new errorResponse(
        'Not authorizaed to access this route - cannot verify token',
        401
      )
    );
  }
});

//Grant access to specific roles
// exports.authorize = (...roles) => {
//   return (req, res, next) => {
//     console.log(req.user);
//     if (!roles.includes(req.user.role)) {
//       return next(
//         new errorResponse(
//           `User role ${req.user.role} is not authorized to access this route`,
//           403
//         )
//       );
//     }
//     next();
//   };
// };
