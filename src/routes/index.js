const express = require('express');

const routes = express.Router();

const index = require('../controller/index');

routes.get('/login', index.store);
routes.get('/callback?', index.storeKey);
module.exports = routes;
