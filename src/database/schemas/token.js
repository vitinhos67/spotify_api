const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    default: 'not_token',
  },

  expireAt: {
    type: Date,
    default: Date.now,
    index: { expires: 3600 },
  },

});

module.exports = mongoose.model('token', tokenSchema);
