const fs = require('fs');
const User = require('../models/User');
const Event = require('../models/Event');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//desc    CREATE Event
//route   POST /api/event
//access  private
exports.createEvent = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const {
    eventName,
    date,
    eventType,
    address,
    location,
    thumbUrl,
    description,
  } = req.body;

  if (!eventName || !date || !eventType || !location || !description) {
    return next(new ErrorResponse('Please enter all neceesarily info.', 400));
  }

  const event = await Event.create({
    eventName,
    user: userId,
    date,
    eventType,
    address,
    location,
    thumbUrl,
    description,
  });

  res.status(200).json({ success: true, data: event });
});

//desc    DELETE Event by ID
//route   DELETE /api/event/:id
//access  private
exports.deleteEventById = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(ErrorResponse('Event not found', 400));
  }

  if (userId === event.user.toString()) {
    await event.remove();
  } else {
    return next(ErrorResponse('User not authorized', 400));
  }

  res.status(200).json({ success: true, data: 'event deleted' });
});

//desc    GET all Events
//route   GET /api/event
//access  public
exports.getEvents = asyncHandler(async (req, res, next) => {
  const events = await Event.find();

  if (!events) {
    return next(ErrorResponse('No events found', 400));
  }

  res.status(200).json({ success: true, data: events });
});

//desc    GET Event by ID
//route   GET /api/events/:id
//access  private
exports.getEventById = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(ErrorResponse('No event with this ID found', 400));
  }

  res.status(200).json({ success: true, data: event });
});
