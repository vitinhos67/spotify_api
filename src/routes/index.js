const express = require('express');

const routes = express.Router();

const index = require('../controller/index');
const { auth } = require('../middleware/auth');

routes.get('/', index.show);
routes.post('/', auth, index.store);
module.exports = routes;
