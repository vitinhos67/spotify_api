const express = require('express');

const routes = express.Router();

const index = require('../controller/tracks');
const token_procedure = require('../controller/token-spotify');
const token_jwt = require('../controller/jwt-token');
const user = require('../controller/user');
const authorization = require('../middleware/request_tracks_auth');

// ROUTE FOR CREATE/DELETE/UPTADE/READ USER
routes.post('/user', user.store);
routes.get('/user/', user.show);

routes.post('/user/update/username', user.updateUsername);
routes.post('/user/update/email', user.updateEmail);
routes.post('/user/update/password', user.updatePassword);

// ROUTE TO PROCESSING/REDIRECT/CREATE OF TOKEN SPOTIFY
routes.get('/token', token_procedure.redirectToAuthorizedURI);
routes.get('/callback', token_procedure.tokenStore);

// ROUTE RELATIONAL WITH API SPOTIFY
routes.get('/', index.findTrack);
routes.get('/search', index.createPlaylist);
routes.get('/create_playlist/:artist', index.playlistTestCreate);

// ROUTE ACTION USER
routes.post('/liked-track', authorization.basics, index.addSongsInTracksLiked);
routes.delete('/liked-track', authorization.basics, index.removeTrack);

// ROUTE FOR CREATE TOKEN JWT
routes.post('/auth/token', token_jwt.store);

module.exports = routes;
