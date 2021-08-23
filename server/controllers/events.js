const fs = require('fs');
const Comment = require('../models/Comment');
const Event = require('../models/Event');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const aws = require('aws-sdk');

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

  let dateFormattedFromJSON;
  if (req.body.admin) {
    dateFormattedFromJSON = date;
  } else {
    dateFormattedFromJSON = JSON.parse(date);
  }

  const dateParsed = Date.parse(dateFormattedFromJSON);
  const endDate = dateParsed + 1000 * 60 * 60 * hours;

  const eventPic = req.file;
  let eventPicUrl;

  aws.config.setPromisesDependency();
  aws.config.update({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    region: process.env.REGION,
  });

  const s3 = new aws.S3();

  //extracted the 'save to S3 process' out to a function
  //don't need to do that
  const upload = (pic) => {
    let params = {
      ACL: 'public-read',
      Bucket: process.env.BUCKET_NAME,
      Body: fs.createReadStream(pic.path),
      Key: `eventPic/${pic.originalname}`,
    };
    s3.upload(params, async (err, data) => {
      if (err) {
        res.json({ msg: err });
      }

      fs.unlinkSync(pic.path);

      if (data) {
        eventPicUrl = data.Location;
        console.log(
          'EventPic has been uploaded to S3 and URL created successfully'
        );

        const event = await Event.create({
          eventName,
          user: userId,
          status,
          date: dateParsed,
          endDate,
          eventPic: eventPicUrl,
          eventType,
          address,
          location,
          thumbUrl,
          description,
        });
        if (!req.body.admin) {
          res.status(200).json({ success: true, data: event });
          return;
        }
      }
    });
  };
  if (!req.body.admin) {
    await upload(eventPic);
  } else {
    await Event.create({
      eventName,
      user: userId,
      status,
      date: dateParsed,
      endDate,
      eventPic: req.body.eventPic,
      eventType,
      address,
      location,
      thumbUrl,
      description,
    });
  }
});

//desc    DELETE Event by ID
//route   DELETE /api/events/:id
//access  private
exports.deleteEventById = asyncHandler(async (req, res, next) => {
  const event = await Event.findOne({ _id: req.params.id });
  const userId = req.user.id;

  if (!event) {
    return next(new ErrorResponse('Event not found', 400));
  }

  const eventPic = 'eventPic/' + event.eventPic.split('/').pop();

  const deleteParam = {
    Bucket: process.env.BUCKET_NAME,
    Key: eventPic,
  };

  if (event.user.toString() === userId) {
    const s3 = new aws.S3({
      accessKeyId: process.env.ACCESSKEYID,
      secretAccessKey: process.env.SECRETACCESSKEY,
      Bucket: process.env.BUCKET_NAME,
    });

    await s3
      .deleteObject(deleteParam, (err, data) => {
        if (err) console.error('err: ', err);
        if (data) console.log('data:', data);
      })
      .promise();

    if (event.user.toString() === userId) {
      await event.remove();
    } else {
      return next(
        new ErrorResponse('You are not authorized to delete this event.', 400)
      );
    }
  }
  await Comment.deleteMany({ eventId: event });

  const events = await Event.find();

  res.status(200).json({
    success: true,
    data: events,
  });
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
