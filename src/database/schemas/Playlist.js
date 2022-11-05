const mongoose = require('mongoose');

const SchemaPlaylist = new mongoose.Schema({

  name: {
    type: String,
    required: true,
  },
  author_id: {
    type: String,
    required: true,
  },
  tracks: {
    type: Array,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },

});

module.exports = mongoose.model('playlists', SchemaPlaylist);
