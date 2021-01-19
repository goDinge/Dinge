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
