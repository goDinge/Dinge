const mongoose = require('mongoose');

const DingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  description: {
    type: String,
    required: true,
    default: 'no description provided.',
  },
  dingType: {
    type: String,
    enum: ['ding', 'billboard'],
    default: 'ding',
  },
  location: {
    longitude: {
      type: Number,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
  },
  thumbUrl: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
    required: true,
  },
  likes: {
    type: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  comments: {
    type: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Comment',
      },
    ],
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
});
DingSchema.index({ location: '2dsphere' });

module.exports = Ding = mongoose.model('Ding', DingSchema);
