require('dotenv').config({
  path: '../../.env',
});

const spotifyKeys = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,

};
const spotifyURL = {
  endpoint: 'https://api.spotify.com',
};

const configs = {
  sess: process.env.SECRET,
};

module.exports = { spotifyKeys, spotifyURL, configs };
