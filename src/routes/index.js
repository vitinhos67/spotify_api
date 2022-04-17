const express = require('express');

const routes = express.Router();

const index = require('../controller/index');

routes.get('/', index.home);
routes.get('/token', index.storeToken);
routes.get('/callback?', index.tokenValidate);

module.exports = routes;
