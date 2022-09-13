const mongoose = require('mongoose');

const tracks_liked_schema = new mongoose.Schema({

  id_user: {
    type: String,
    required: true,
  },
  id_track: {
    type: String,
    required: true,
  },
  create_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('tracks_liked', tracks_liked_schema);
