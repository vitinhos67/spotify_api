require('dotenv').config();

const helmet = require('helmet');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { json } = require('express');
const app = require('./server');
const errors = require('./src/middleware/errors/error.handler');
const routes = require('./src/routes');

(async () => {
  /** database  */

  require('./src/database/connection/index');

  /** database * */

  app.use(cors({ origin: '*' }));
  app.use(helmet());
  app.use(json());
  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.sess,
      saveUninitialized: true,
      cookie: { maxAge: 60000 },
      resave: false,
    }),
  );

  app.use(routes);
  app.use(errors);

  module.exports = app;
})();
