const express = require('express');

const routes = express.Router();
const index = require('../controller/tracks.handler');
const {
  generateRandomPlaylist,
  addTrack,
  storePlaylists,
  getAllPlaylists,
} = require('../controller/playlist.handler');

const {
  updateEmail,
  show,
  updatePassword,
  storeUser,
  updateUsername,
  login,
} = require('../controller/user.handler');

const token_jwt = require('../controller/jwt.handler');
const { AuthBearer } = require('../middleware/Authentication');

routes.post('/user', storeUser);
routes.get('/user', show);

routes.put('/user/update/username', AuthBearer, updateUsername);
routes.put('/user/update/email', AuthBearer, updateEmail);
routes.put('/user/update/password', AuthBearer, updatePassword);

routes.post('/login', login);

routes.get('/playlist/generate', AuthBearer, generateRandomPlaylist);
routes.post('/playlist', AuthBearer, storePlaylists);
routes.get('/playlist', getAllPlaylists);
routes.put('/playlist/add/track', AuthBearer, addTrack);

routes.get('/track', index.findTrack);
routes.put('/track/:track_id', AuthBearer, index.addSongsInTracksLiked);
routes.delete('/track/:track_id', AuthBearer, index.removeTrack);

routes.post('/auth/token', token_jwt.store);
routes.post('/auth/reflesh_token/:reflesh_token', token_jwt.reflesh);

module.exports = routes;
