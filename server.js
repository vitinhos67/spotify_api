require('dotenv').config();
const app = require('./app');

const { PORT_ENV } = process.env;

app.listen(PORT_ENV, async () => {
  console.log(`Listening port ${PORT_ENV} in mode development`);
});
