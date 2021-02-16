const mongoose = require('mongoose');

const DingSchema = new mongoose.Schema({
  user: {
    //type: mongoose.Schema.ObjectId,
    //ref: 'User',
    //required: true,
    type: String,
    default: 'testing default user',
  },
  description: {
    type: String,
    required: true,
  },
  dingType: {
    type: String,
    enum: ['ding', 'billboard'],
    default: 'ding',
  },
  location: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
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

module.exports = Ding = mongoose.model('Ding', DingSchema);
