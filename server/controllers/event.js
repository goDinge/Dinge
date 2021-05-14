const Event = require('../models/Event');
const User = require('../models/User');
const Comment = require('../models/Comment');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const repScores = require('../utils/repScores');

//desc    UPDATE Event's location by ID
//route   PUT /api/event/:id/:location
//access  private
exports.updateEventLocation = asyncHandler(async (req, res, next) => {
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;

  await Event.updateOne(
    { _id: req.params.id },
    { $set: { location: { longitude: longitude, latitude: latitude } } }
  );

  const event = await Event.findById(req.params.id);

  await event.save();

  res.status(200).json({ success: true, data: event });

  // if (userId != event.user) {
  //   return next(new ErrorResponse('You are not authorized.', 400));
  // }
});
