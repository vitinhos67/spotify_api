const spotifyKeys = {
  client_id: process.env.client_id,
  client_secret: process.env.client_secret,
};
const spotifyURL = {
  endpoint: 'https://api.spotify.com',
  accountsEndpoint: 'https://accounts.spotify.com/api/token',
};

const configs = {
  sess: process.env.sess,
  mongodb_uri: process.env.mongodb_uri,
  json_web_secret: process.env.json_web_secret,
  endpoint: process.env.endpoint,
  port: process.env.PORT,
};

module.exports = { spotifyKeys, spotifyURL, configs };
