const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email address'],
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please enter a valid email address',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  avatar: {
    type: String,
    default: 'https://dinge.s3.us-east-2.amazonaws.com/avatar/avatar.png',
  },
  role: {
    type: String,
    enum: ['user', 'business', 'admin'],
    default: 'user',
  },
  reputation: {
    type: Number,
    default: 0,
  },
  level: {
    type: String,
    enum: ['Rookie', 'Citizen', 'Influencer', 'Community Leader', 'Dinge Boss'],
    default: 'Rookie',
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
  },
  following: {
    type: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  followers: {
    type: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  credits: {
    type: Number,
  },
  reports: {
    type: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastModifiedAt: {
    type: Date,
    default: Date.now,
  },
  verificationCode: String,
  verificationCodeExpire: Date,
});

//encrypt password, if it is being modified
//skipped when requesting to change password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//reset password
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

UserSchema.methods.getVerificationCode = function () {
  const veriCodeNumber = getRandomInt(1000, 9999);
  const veriCode = veriCodeNumber.toString();
  console.log(veriCode);

  this.verificationCode = crypto
    .createHash('sha256')
    .update(veriCode)
    .digest('hex');

  //this.verificationCode = veriCode;
  this.verificationCodeExpire = Date.now() + 30 * 60 * 1000; //30 mins

  return veriCode;
};

//static method to calcuate reputation
UserSchema.statics.getLevel = async function (userId) {
  console.log(userId);

  try {
    const user = await this.model('User').findById(userId);
    if (user.reputation > 10) {
      await User.updateOne({ _id: userId }, { level: 'Influencer' });
    }
  } catch (error) {
    console.error(error);
  }
};

UserSchema.post('save', function () {
  console.log('User schema post-save method triggered');
  this.constructor.getLevel(this._id);
});

module.exports = User = mongoose.model('User', UserSchema);
