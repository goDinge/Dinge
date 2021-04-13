const Ding = require('../models/Ding');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const repScores = require('../utils/repScores');

//desc    LIKE Ding
//route   PUT /api/ding/likes/:id
//access  private
exports.likeDing = asyncHandler(async (req, res, next) => {
  const ding = await Ding.findById(req.params.id);
  const dingUser = await User.findById(ding.user);
  const user = await User.findById(req.user.id);

  const userId = req.user.id;
  const dingLikes = ding.likes;

  if (!dingLikes.includes(userId)) {
    dingLikes.push(userId);
  } else {
    return next(new ErrorResponse('User has already liked this Ding', 400));
  }

  await ding.save();

  if (dingUser.id !== user.id) {
    dingUser.reputation =
      dingUser.reputation + repScores.repScores.likeReceived;
    if (dingUser.reputation >= 5) {
      dingUser.level = 'Citizen';
    }
    await dingUser.save();

    user.reputation = user.reputation + repScores.repScores.likeGiven;
    if (user.reputation >= 5) {
      user.level = 'Citizen';
    }
    await user.save();
  }

  res.status(200).json({ success: true, data: ding });
});

//desc    UNLIKE Ding
//route   DELETE /api/ding/:id
//access  private
exports.unlikeDing = asyncHandler(async (req, res, next) => {
  await Ding.updateOne(
    { _id: req.params.id },
    { $pull: { likes: req.user.id } }
  );

  const ding = await Ding.findById(req.params.id);
  const dingUser = await User.findById(ding.user);
  const user = await User.findById(req.user.id);

  if (dingUser.id !== user.id) {
    dingUser.reputation =
      dingUser.reputation - repScores.repScores.likeReceived;
    if (dingUser.reputation >= 5) {
      dingUser.level = 'Citizen';
    }
    await dingUser.save();

    user.reputation = user.reputation - repScores.repScores.likeGiven;
    if (user.reputation >= 5) {
      user.level = 'Citizen';
    }
    await user.save();
  }

  res.status(200).json({
    success: true,
    data: ding,
  });
});

//desc    DELETE Ding by ID
//route   DELETE /api/ding/:id
//access  private
exports.deleteDingById = asyncHandler(async (req, res, next) => {
  const ding = await Ding.findOne({ _id: req.params.id });
  const dingUser = await User.findById(ding.user);
  const userId = req.user.id;

  if (ding.user.toString() === userId) {
    await ding.remove();
    dingUser.reputation = dingUser.reputation - repScores.repScores.uploadDing;
    await dingUser.save();
  } else {
    return next(
      new ErrorResponse('User not authorized to delete this Ding', 400)
    );
  }

  res.status(200).json({
    success: true,
    data: 'ding removed',
  });
});

//Helper function
//Reputation and Level calculation
const repLevelCalc = async (dingUser, user) => {
  if (dingUser.id !== user.id) {
    dingUser.reputation =
      dingUser.reputation - repScores.repScores.likeReceived;
    if (dingUser.reputation >= 5) {
      dingUser.level = 'Citizen';
    }
    await dingUser.save();

    user.reputation = user.reputation - repScores.repScores.likeGiven;
    if (user.reputation >= 5) {
      user.level = 'Citizen';
    }
    await user.save();
  }
};
