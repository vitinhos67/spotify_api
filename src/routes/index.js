const express = require('express');

const routes = express.Router();

const index = require('../controller/index');

routes.get('/', index.store);
routes.post('/', index.show);

module.exports = routes;
