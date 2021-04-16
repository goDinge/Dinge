const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  ding: {
    type: mongoose.Schema.ObjectId,
    ref: 'Ding',
    required: true,
  },
});

module.exports = Comment = mongoose.model('Comment', CommentSchema);
