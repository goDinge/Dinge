const Ding = require('../models/Ding');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//desc    CREATE Ding
//route   POST /api/dinge
//access  private
exports.createDing = asyncHandler(async (req, res, next) => {
  const user = req.user.id;
  const { title, dingType, location, thumbUrl, imgUrl } = req.body;

  if (!title || !location || !thumbUrl || !imgUrl) {
    return next(new ErrorResponse('Please upload all info required.', 400));
  }

  const ding = await Ding.create({
    user,
    title,
    dingType,
    location,
    thumbUrl,
    imgUrl,
  });

  res.status(200).json({ success: true, data: ding });
});

//desc    GET all Dinge
//route   GET /api/dinge
//access  public
exports.getDinge = asyncHandler(async (req, res, next) => {
  const dinge = await Ding.find();
  res.status(200).json({ success: true, data: dinge });
});
