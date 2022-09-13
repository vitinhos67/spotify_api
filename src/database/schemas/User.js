const mongoose = require('mongoose');

const schemaUser = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },

  tracks_liked: {
    type: Array,
    default: [],
  },

});

module.exports = mongoose.model('users', schemaUser);
