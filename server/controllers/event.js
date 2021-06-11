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
});

//desc    LIKE Event
//route   PUT /api/event/likes/:id
//access  private
exports.likeEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  const eventUser = await User.findById(event.user);
  const user = await User.findById(req.user.id);

  const userId = req.user.id;
  const eventLikes = event.likes;

  if (!eventLikes.includes(userId)) {
    eventLikes.push(userId);
  } else {
    return next(new ErrorResponse('User has already liked this event', 400));
  }

  await event.save();

  if (eventUser.id !== user.id) {
    eventUser.reputation =
      eventUser.reputation + repScores.repScores.likeReceived;
    await eventUser.save();

    user.reputation = user.reputation + repScores.repScores.likeGiven;
    await user.save();
  }

  res.status(200).json({ success: true, data: event });
});

//desc    UNLIKE Event
//route   DELETE /api/event/likes/:id
//access  private
exports.unlikeEvent = asyncHandler(async (req, res, next) => {
  await Event.updateOne(
    { _id: req.params.id },
    { $pull: { likes: req.user.id } }
  );

  const event = await Event.findById(req.params.id);
  const eventUser = await User.findById(event.user);
  const user = await User.findById(req.user.id);

  if (eventUser.id !== user.id) {
    eventUser.reputation =
      eventUser.reputation - repScores.repScores.likeReceived;
    if (eventUser.reputation >= 5) {
      eventUser.level = 'Citizen';
    }
    await eventUser.save();

    user.reputation = user.reputation - repScores.repScores.likeGiven;
    if (user.reputation >= 5) {
      user.level = 'Citizen';
    }
    await user.save();
  }

  res.status(200).json({
    success: true,
    data: event,
  });
});

//desc    REPORT Event
//route   PUT /api/event/reports/:id
//access  private
exports.reportEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  const eventUser = await User.findById(event.user);
  const user = await User.findById(req.user.id);

  const eventReports = event.reports;

  if (!eventReports.includes(user.id)) {
    eventReports.push(user.id);
  } else {
    return next(
      new ErrorResponse('You have previously reported this event. Thanks.', 400)
    );
  }

  eventUser.reputation =
    eventUser.reputation - repScores.repScores.reportReceived;
  await eventUser.save();

  user.reputation = user.reputation + repScores.repScores.reportGiven;
  await user.save();

  await event.save();

  res.status(200).json({
    success: true,
    data: 'event reported',
  });
});

//desc    UNREPORT Event
//route   DELETE /api/event/reports/:id
//access  private
exports.unReportEvent = asyncHandler(async (req, res, next) => {
  await Event.updateOne(
    { _id: req.params.id },
    { $pull: { reports: req.user.id } }
  );

  const event = await Event.findOne({ _id: req.params.id });
  const eventUser = await User.findById(event.user);
  const user = await User.findById(req.user.id);

  eventUser.reputation =
    eventUser.reputation + repScores.repScores.reportReceived;
  await eventUser.save();

  user.reputation = user.reputation - repScores.repScores.reportGiven;
  await user.save();

  await event.save();

  res.status(200).json({
    success: true,
    data: 'event unreported',
  });
});

//desc    DELETE Event by ID
//route   DELETE /api/event/:id
//access  private
exports.deleteEventById = asyncHandler(async (req, res, next) => {
  const event = await Event.findOne({ _id: req.params.id });
  const userId = req.user.id;

  if (event.user.toString() === userId) {
    await event.remove();
  } else {
    return next(
      new ErrorResponse('You are not authorized to delete this event.', 400)
    );
  }

  await Comment.deleteMany({ eventId: event });

  const events = await Event.find();

  res.status(200).json({
    success: true,
    data: events,
  });
});
