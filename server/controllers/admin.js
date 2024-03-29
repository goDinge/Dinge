const User = require('../models/User');
const Event = require('../models/Event');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const aws = require('aws-sdk');
const events = require('../eventsData/events.json');
const { createEvent } = require('./events');

//desc     get all users
//route    GET /api/admin/users
//access   Private
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();

  if (!users) {
    return next(new ErrorResponse(`No users found.`));
  }

  res.status(200).json(users);
});

//desc     DELETE all events in mongoDB after 24 hours after event endDate
//route    DELETE /api/admin/events
//access   Private
exports.deleteEvents = asyncHandler(async (req, res, next) => {
  const currentTime = Date.now();
  const oneDay = 1000 * 60 * 60 * 24;

  //delete mongoDB documents
  const eventFilter = {
    endDate: {
      $lt: currentTime - oneDay,
    },
  };

  const eventsToDelete = await Event.find(eventFilter);

  if (!eventsToDelete) {
    return next(new ErrorResponse('No events found.'));
  }

  //delete AWS S3 eventPics
  const eventPicsToDelete = [];

  eventsToDelete.forEach((elem) => {
    if (elem.eventPic) {
      eventPicsToDelete.push({
        Key: 'eventPic/' + elem.eventPic.split('/').pop(),
      });
    }
  });

  const deleteParam = {
    Bucket: process.env.BUCKET_NAME,
    Delete: {
      Objects: eventPicsToDelete,
    },
  };

  const s3 = new aws.S3({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    Bucket: process.env.BUCKET_NAME,
  });

  await s3
    .deleteObjects(deleteParam, (err, data) => {
      if (err) console.error('err: ', err);
      if (data) console.log('data:', data);
    })
    .promise();

  await Event.deleteMany(eventFilter);
  res.status(200).json({ success: true });
});

//desc     CREATE multiple events
//route    POST /api/admin/events
//access   Private
exports.createEvents = asyncHandler(async (req, res, next) => {
  const eventsArray = events;

  eventsArray.forEach((elem) => {
    req.body.admin = true;
    req.body.eventName = elem.eventName;
    req.body.status = elem.status;
    req.body.date = elem.date;
    req.body.hours = elem.hours;
    req.body.eventType = elem.eventType;
    req.body.address = elem.address;
    req.body.location = elem.location;
    req.body.thumbUrl = elem.thumbUrl;
    req.body.description = elem.description;
    req.body.eventPic = elem.eventPic;
    createEvent(req, res, next);
  });

  res.status(200).json({ success: true });
});

//desc     DELETE all event pics from AWS S3 after 24 hours after event endDate
//route    DELETE /api/admin/eventPics
//access   Private
exports.deleteEventPics = asyncHandler(async (req, res, next) => {
  res.status(200).json('');
});
