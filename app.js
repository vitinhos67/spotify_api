// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config();
const express = require('express');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;
const routes = require('./src/routes');

app.use(express.json);
app.use(helmet);
app.use(routes);

app.listen(PORT, () => {
  console.log(`Listening PORT${3000}`);
});
