const fs = require('fs');
const Event = require('../models/Event');
const User = require('../models/User');
const Comment = require('../models/Comment');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const repScores = require('../utils/repScores');
const aws = require('aws-sdk');

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
    res.status(400).send('You have previously reported this event. Thanks.');
    return;
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
// exports.deleteEventById = asyncHandler(async (req, res, next) => {
//   const event = await Event.findOne({ _id: req.params.id });
//   const userId = req.user.id;

//   if (!event) {
//     return next(new ErrorResponse('Event not found', 400));
//   }

//   const eventPic = 'eventPic/' + event.eventPic.split('/').pop();

//   const deleteParam = {
//     Bucket: process.env.BUCKET_NAME,
//     Key: eventPic,
//   };

//   if (ding.user.toString() === userId) {
//     const s3 = new aws.S3({
//       accessKeyId: process.env.ACCESSKEYID,
//       secretAccessKey: process.env.SECRETACCESSKEY,
//       Bucket: process.env.BUCKET_NAME,
//     });

//     await s3
//       .deleteObject(deleteParam, (err, data) => {
//         if (err) console.error('err: ', err);
//         if (data) console.log('data:', data);
//       })
//       .promise();

//     if (event.user.toString() === userId) {
//       await event.remove();
//     } else {
//       return next(
//         new ErrorResponse('You are not authorized to delete this event.', 400)
//       );
//     }
//   }
//   await Comment.deleteMany({ eventId: event });

//   const events = await Event.find();

//   res.status(200).json({
//     success: true,
//     data: events,
//   });
// });

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

//desc    UPDATE Event by ID
//route   PUT /api/event/:id
//access  private
exports.updateEvent = asyncHandler(async (req, res, next) => {
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

  const eventPic = req.file;
  let eventPicUrl;

  const dateFormattedFromJSON = JSON.parse(date);
  const dateParsed = Date.parse(dateFormattedFromJSON);

  const endDate = dateParsed + 1000 * 60 * 60 * hours;

  aws.config.setPromisesDependency();
  aws.config.update({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    region: process.env.REGION,
  });

  const s3 = new aws.S3();

  const uploadWithNewPic = (pic) => {
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

        await Event.updateOne(
          {
            _id: req.params.id,
          },
          {
            $set: {
              eventName,
              status: 'active',
              date: dateParsed,
              endDate,
              eventPic: eventPicUrl,
              eventType,
              address,
              location,
              thumbUrl,
              description,
              lastModifiedAt: Date.now(),
            },
          }
        );

        const event = await Event.findById(req.params.id).populate('comments');
        res.status(200).json({ success: true, data: event });
      }
    });
  };

  //This will only be called from web-ts, when no new eventPic has been chosen
  //new eventPic will always be passed from mobile even if user does not pick a new pic
  const upload = async () => {
    await Event.updateOne(
      {
        _id: req.params.id,
      },
      {
        $set: {
          eventName,
          status: 'active',
          date: dateParsed,
          endDate,
          eventType,
          address,
          location,
          thumbUrl,
          description,
          lastModifiedAt: Date.now(),
        },
      }
    );

    const event = await Event.findById(req.params.id).populate('comments');
    res.status(200).json({ success: true, data: event });
  };

  if (eventPic.size === 0) {
    await upload();
  } else {
    await uploadWithNewPic(eventPic);
  }
});
