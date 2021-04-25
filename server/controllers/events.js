const fs = require('fs');
const User = require('../models/User');
const Event = require('../models/Event');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//desc    CREATE Event
//route   POST /api/event
//access  private
exports.createEvent = asyncHandler(async (req, res, next) => {
  console.log('create event');
  const userId = req.user.id;
  console.log(userId);
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

//eventName: Marketing Meeting
//address: 134 Peter St 12th floor, Toronto, ON M5V 2H2
//location: lat: 43.648303736639555, lng: -79.39395524010823
//date: May 1st, 2021 7pm - "<YYYY-mm-ddTHH:MM:ss>" - "<2021-05-01T19:00:00>"
//new Date("<2021-05-01T19:00:00>"a)
//https://docs.mongodb.com/manual/reference/method/Date/
//eventType: "business"
//description: "Marketing at Publics Sapient office"
