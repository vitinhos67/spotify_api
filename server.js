require('dotenv').config();

const app = require('./app');

const { port } = require('./config/constants').configs;

app.listen(port, async () => {
  console.log(`Listening port ${port} in mode development`);
});
