const fs = require('fs');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Event = require('../models/Event');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//desc    CREATE Event
//route   POST /api/events
//access  private
exports.createEvent = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const {
    eventName,
    status,
    date,
    hours,
    eventType,
    address,
    location,
    thumbUrl,
    description,
  } = req.body;

  if (
    !eventName ||
    !date ||
    !eventType ||
    !location ||
    !description ||
    !hours
  ) {
    return next(new ErrorResponse('Please enter all neceesarily info.', 400));
  }

  const endDate = Date.parse(date) + 1000 * 60 * 60 * hours;

  const event = await Event.create({
    eventName,
    user: userId,
    status,
    date,
    endDate,
    eventType,
    address,
    location,
    thumbUrl,
    description,
  });

  res.status(200).json({ success: true, data: event });
});

//desc    DELETE Event by ID
//route   DELETE /api/events/:id
//access  private
exports.deleteEventById = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new ErrorResponse('Event not found', 400));
  }

  if (userId === event.user.toString()) {
    await event.remove();
    await Comment.deleteMany({ eventId: event._id });
  } else {
    return next(new ErrorResponse('User not authorized', 400));
  }

  const events = await Event.find();

  res.status(200).json({ success: true, data: events });
});

//desc    GET all Events
//route   GET /api/events
//access  public
exports.getEvents = asyncHandler(async (req, res, next) => {
  const events = await Event.find();

  if (!events) {
    return next(new ErrorResponse('No events found', 400));
  }

  res.status(200).json({ success: true, data: events });
});

//desc    GET local events
//route   GET /api/events/local/:location/:distance
//access  private
exports.getLocalEvents = asyncHandler(async (req, res, next) => {
  const { distance } = req.params;
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;

  //radius of earth: 3963 miles or 6378 kilometers
  const radius = distance / 6378;
  const events = await Event.find({
    location: {
      $geoWithin: { $centerSphere: [[longitude, latitude], radius] },
    },
  });

  if (!events) {
    return next(new ErrorResponse('No nearby events found', 400));
  }

  res.status(200).json({ success: true, number: events.length, data: events });
});

//desc    GET Event by ID
//route   GET /api/events/:id
//access  private
exports.getEventById = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id).populate('comments');

  if (!event) {
    return next(new ErrorResponse('No event with this ID found', 400));
  }

  res.status(200).json({ success: true, data: event });
});

// desc    GET authUser events
// route   GET /api/events/authuser
// access  private
exports.getEventsByAuthUser = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    return next(new ErrorResponse('No user with this ID found', 400));
  }

  const events = await Event.find({ user: userId });

  res.status(200).json({ success: true, data: events });
});

//desc    GET all active authUser events //events that haven't ended
//route   GET /api/events/authuser/active
//access  private
// exports.getActiveEventsByAuthUser = asyncHandler(async (req, res, next) => {
//   const userId = req.user.id;

//   if (!userId) {
//     return next(new ErrorResponse('No user with this ID found', 400));
//   }

//   const currentTime = Date.now();

//   const events = await Event.find({ user: userId });

//   const activeEvents = events.filter(
//     (event) => currentTime < Date.parse(event.endDate)
//   );

//   res.status(200).json({ success: true, data: activeEvents });
// });

//desc    GET All Events under User ID
//route   GET /api/events/user/:id
//access  private
// exports.getEventsByUserId = asyncHandler(async (req, res, next) => {
//   const userId = req.params.id;

//   if (!userId) {
//     return next(new ErrorResponse('No user with this ID found', 400));
//   }

//   const events = await Event.find({ user: userId });

//   res.status(200).json({ success: true, data: events });
// });

//desc    GET All Active Events under User ID //events that haven't ended
//route   GET /api/events/user/active/:id
//access  private
// exports.getActiveEventsByUserId = asyncHandler(async (req, res, next) => {
//   const userId = req.params.id;

//   if (!userId) {
//     return next(new ErrorResponse('No user with this ID found', 400));
//   }

//   const currentTime = Date.now();

//   const events = await Event.find({ user: userId });

//   const activeEvents = events.filter(
//     (event) => currentTime < Date.parse(event.endDate)
//   );

//   res.status(200).json({ success: true, data: activeEvents });
// });
