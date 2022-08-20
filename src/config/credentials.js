const spotifyKeys = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,

};
const spotifyURL = {
  endpoint: 'https://api.spotify.com',
  accountsEndpoint: 'https://accounts.spotify.com/api/token',
};

const configs = {
  sess: process.env.SECRET,
  mongodb_uri: process.env.MONGODB_URI,
  json_web_secret: process.env.JSON_WEB_SECRET,
};

module.exports = { spotifyKeys, spotifyURL, configs };
