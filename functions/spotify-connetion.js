const Spotify = require('node-spotify-api');

const credentials = require('../src/config/credentials');

const { spotifyKeys } = credentials;

const spotify = new Spotify({
  id: spotifyKeys.client_id,
  secret: spotifyKeys.client_secret,
});

module.exports = spotify;
