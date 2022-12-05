require('dotenv').config();
const app = require('./app');

const { PORT_DEV } = process.env;

app.listen(PORT_DEV, async () => {
  console.log(`Listening port ${PORT_DEV} in mode development`);
});
