const express = require('express');

const routes = express.Router();

const index = require('../controller/tracks.handler');
const playlist = require('../controller/playlist.handler');
const token_procedure = require('../controller/token-spotify');
const token_jwt = require('../controller/jwt.handler');
const user = require('../controller/user.handler');
const authorization = require('../middleware/Authentication');

// ROUTE FOR CREATE/DELETE/UPTADE/READ USER
routes.post('/user', user.store);
routes.get('/user/', user.show);

routes.post('/user/update/username', user.updateUsername);
routes.post('/user/update/email', user.updateEmail);
routes.post('/user/update/password', user.updatePassword);

// ROUTE TO PROCESSING/REDIRECT/CREATE OF TOKEN SPOTIFY
routes.get('/token', token_procedure.redirectToAuthorizedURI);
routes.get('/callback', token_procedure.tokenStore);

// ROUTE RELATIONAL WITH PLAYLIST
routes.get('/generate', authorization.basics, playlist.generateRandom);
routes.get('/create', authorization.basics, playlist.store);
routes.get('/track/add', authorization.basics, playlist.addTrack);

// ROUTE ACTION USER AND TRACKS
routes.get('/', index.findTrack);
routes.post('/liked-track', authorization.basics, index.addSongsInTracksLiked);
routes.delete('/liked-track', authorization.basics, index.removeTrack);

// ROUTE FOR CREATE TOKEN JWT
routes.post('/auth/token', token_jwt.store);

module.exports = routes;
