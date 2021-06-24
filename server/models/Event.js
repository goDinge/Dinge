const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  date: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  eventPic: {
    type: String,
  },
  eventType: {
    type: String,
    required: true,
    default: 'other',
  },
  address: {
    type: String,
    required: false,
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
  description: {
    type: String,
    required: true,
    default: 'No description provided.',
  },
  thumbUrl: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: [
      {
        type: String,
      },
    ],
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
        ref: 'EventComment',
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

module.exports = Event = mongoose.model('Event', EventSchema);
