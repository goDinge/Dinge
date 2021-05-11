const fs = require('fs');
const Ding = require('../models/Ding');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const repScores = require('../utils/repScores');
const aws = require('aws-sdk');

//desc    CREATE Ding
//route   POST /api/dinge
//access  private
exports.createDing = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(req.user.id);
  const { description, dingType, location } = req.body;

  let imgUrl, thumbUrl;

  if (!description || !location) {
    return next(
      new ErrorResponse('Please enter title and location info.', 400)
    );
  }

  uploads = req.files;
  aws.config.setPromisesDependency();
  aws.config.update({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    region: process.env.REGION,
  });

  const s3 = new aws.S3();

  let folder;

  console.log(uploads);

  uploads.forEach((upload) => {
    folder = 'img';
    if (upload.originalname.includes('-thumb')) {
      folder = 'thumbnails';
    }
    let params = {
      ACL: 'public-read',
      Bucket: process.env.BUCKET_NAME,
      Body: fs.createReadStream(upload.path),
      Key: `${folder}/${upload.originalname}`,
    };

    s3.upload(params, async (err, data) => {
      if (err) {
        res.json({ msg: err });
      }

      fs.unlinkSync(upload.path);

      if (data) {
        if (data.key.includes('thumbnails')) {
          thumbUrl = data.Location;
        } else {
          imgUrl = data.Location;
        }
      }

      //imgUrl and thumbUrl only get populated when all S3 uploads are completed
      //ding only gets saved then
      if (imgUrl && thumbUrl) {
        console.log(
          'Files have been uploaded to S3 and URLs created successfully'
        );

        const ding = await Ding.create({
          user: userId,
          description,
          dingType,
          location,
          thumbUrl,
          imgUrl,
        });

        user.reputation = user.reputation + repScores.repScores.uploadDing;
        user.save();

        res.status(200).json({ success: true, data: ding });
      }
    });
  });
});

//desc     REPORT ding by ID
//route    PUT /api/dinge/reports/:id
//access   Private
exports.reportDing = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const reportedDingId = req.params.id;
  const reportedDing = await Ding.findById(reportedDingId);

  if (!reportedDing) {
    return next(ErrorResponse('No ding with this ID found', 400));
  }

  reportedDing.reports.push(userId);
  reportedDing.save();

  res.status(200).json({
    success: true,
    data: reportedDing,
  });
});

//desc    GET all Dinge
//route   GET /api/dinge
//access  public
exports.getDinge = asyncHandler(async (req, res, next) => {
  const dinge = await Ding.find();

  if (!dinge) {
    return next(ErrorResponse('No dinge found', 400));
  }

  res.status(200).json({ success: true, data: dinge });
});

//desc    GET local Dinge
//route   GET /api/dinge/local/:distance
//route   GET /api/dinge/local/:location/:distance --- if location is in req.params
//access  private
exports.getLocalDinge = asyncHandler(async (req, res, next) => {
  //Ding.index({ location: '2dsphere' });

  const { distance } = req.params;
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;

  console.log(distance);
  console.log(latitude, longitude);

  //radius of earth: 3963 miles or 6378 kilometers
  const radius = distance / 6378;
  const dinge = await Ding.find({
    location: {
      $geoWithin: { $centerSphere: [[latitude, longitude], radius] },
    },
    // location: {
    //   $near: {
    //     $geometry: {
    //       type: 'Point',
    //       coordinates: [latitude, longitude],
    //     },
    //     $maxDistance: distance,
    //   },
    // },
  });

  //   var METERS_PER_MILE = 1609.34
  // db.restaurants.find({ location: { $nearSphere: { $geometry: { type: "Point", coordinates: [ -73.93414657, 40.82302903 ] }, $maxDistance: 5 * METERS_PER_MILE } } })

  if (!dinge) {
    return next(ErrorResponse('No near by dinge found', 400));
  }

  res.status(200).json({ success: true, number: dinge.length, data: dinge });
});

//desc    GET Ding by ID
//route   GET /api/dinge/:id
//access  public
exports.getDing = asyncHandler(async (req, res, next) => {
  const ding = await Ding.findById(req.params.id).populate('comments');

  if (!ding) {
    return next(ErrorResponse('No ding with this ID found', 400));
  }

  res.status(200).json({ success: true, data: ding });
});
