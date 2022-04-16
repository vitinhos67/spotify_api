require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const credentials = require('./src/config/spotify/credentials');

const { configs } = credentials;
const app = express();
const PORT = process.env.PORT || 3000;
const routes = require('./src/routes');

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: configs.sess,
  saveUninitialized: true,
  cookie: { maxAge: 60000 },
  resave: false,
}));
app.use(routes);

app.listen(PORT, () => {
  console.log(`Listening PORT ${PORT}`);
});

module.exports = {
  app,
};
