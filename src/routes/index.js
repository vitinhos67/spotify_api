const express = require('express');

const routes = express.Router();

const index = require('../controller/index');
const token_procedure = require('../controller/token-spotify');

// ROUTE TO PROCESSING/REDIRECT/CREATE OF TOKEN
routes.get('/token', token_procedure.redirectToAuthorizedURI);
routes.get('/callback', token_procedure.tokenStore);

routes.get('/', index.findTrackOrArtist);

module.exports = routes;
