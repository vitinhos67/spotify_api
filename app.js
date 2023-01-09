require('dotenv').config();

const express = require('express');

const app = express();
const helmet = require('helmet');

const cookieParser = require('cookie-parser');
const cors = require('cors');
const { json } = require('express');
const { port } = require('./config/constants').configs;
const errors = require('./src/middleware/errors/error.handler.middleware');
const routes = require('./src/routes');

(async () => {
  /** database  */

  require('./src/database/connection');

  /** database * */

  app.use(cors({ origin: '*' }));
  app.use(helmet());
  app.use(json());
  app.use(cookieParser());

  app.use(routes);
  app.use(errors);

  if (process.env.NODE_ENV === 'test') {
    module.exports = app;
  } else {
    app.listen(port, () => {
      console.log(`Server listening ${port}`);
    });
  }
})();
