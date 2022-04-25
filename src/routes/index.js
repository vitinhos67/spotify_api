const express = require('express');

const routes = express.Router();

const index = require('../controller/index');
const token_procedure = require('../controller/token-spotify');
const token_jwt = require('../controller/jwt-token');
const user = require('../controller/user');

// ROUTE FOR CREATE/DELETE/UPTADE/READ USER
routes.post('/user', user.store);
routes.get('/user', user.show);
routes.post('/user/update', user.uptadeUsername);

// ROUTE TO PROCESSING/REDIRECT/CREATE OF TOKEN SPOTIFY
routes.get('/token', token_procedure.redirectToAuthorizedURI);
routes.get('/callback', token_procedure.tokenStore);

// ROUTE RELATIONAL WITH API SPOTIFY
routes.get('/', index.findTrackOrArtist);

// ROUTE FOR CREATE TOKEN JWT
routes.post('/auth/token', token_jwt.store);

module.exports = routes;
