require('dotenv').config();

exports.spotifyKeys = {
  client_id: process.env.client_id,
  client_secret: process.env.client_secret,
};
exports.spotifyURL = {
  endpoint: 'https://api.spotify.com',
  accountsEndpoint: 'https://accounts.spotify.com/api/token',
};

exports.configs = {
  sess: process.env.sess,
  mongodb_uri: process.env.mongodb_uri,
  mongodb_test: process.env.mongo_db_test,
  json_web_secret: process.env.json_web_secret,
  reflesh_token_secret: process.env.reflesh_token_secret,
  endpoint: process.env.endpoint,
  port: process.env.NODE_ENV === 'test' ? process.env.PORT_DEV : process.env.PORT,
  expiresIn_access_token: process.env.expiresIn_access_token,
  expiresIn_reflesh_token: process.env.expiresIn_reflesh_token,
};
