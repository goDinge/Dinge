const fs = require('fs');
const Ding = require('../models/Ding');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const aws = require('aws-sdk');

//desc    CREATE Ding
//route   POST /api/dinge
//access  private
exports.createDing = asyncHandler(async (req, res, next) => {
  const user = req.user.id;
  //const { title, dingType, location, thumbUrl, imgUrl } = req.body;
  const { title, dingType, location } = req.body;

  let imgUrl, thumbUrl;

  if (!title || !location) {
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

  //console.log(uploads);

  const s3 = new aws.S3();

  let folder; //img vs thumbnails

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

      //submissionPic only created when all uploads are completed
      //submission only gets saved then
      if (imgUrl && thumbUrl) {
        console.log(
          'Files have been uploaded to S3 and URLs created successfully'
        );

        console.log(location);

        const ding = await Ding.create({
          user,
          title,
          dingType,
          location,
          thumbUrl,
          imgUrl,
        });

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

  reportedDing.reports.push(userId);

  reportedDing.save();

  res.status(200).json({
    success: true,
    data: reportedDing,
  });
});

//desc    DELETE Ding by ID
//route   DELETE /api/dinge/:id
//access  public
exports.deleteDingById = asyncHandler(async (req, res, next) => {
  const dingId = req.params.id;
  const ding = await Ding.findByIdAndDelete(dingId);
  res.status(200).json({
    success: true,
    data: ding,
  });
});

//desc    GET all Dinge
//route   GET /api/dinge
//access  public
exports.getDinge = asyncHandler(async (req, res, next) => {
  const dinge = await Ding.find();
  res.status(200).json({ success: true, data: dinge });
});
