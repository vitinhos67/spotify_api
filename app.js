require('dotenv').config();
const express = require('express');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;
const routes = require('./src/routes');

app.use(helmet());
app.use(express.json());

app.use(routes);

app.listen(PORT, () => {
  console.log(`Listening PORT ${PORT}`);
});

module.exports = {
  app,
};
