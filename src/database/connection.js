const mongoose = require('mongoose');
const { mongodb_test, mongodb_uri } = require('../../config/constants').configs;

if (process.env.NODE_ENV === 'test') {
  mongoose.connect(mongodb_test);
} else {
  mongoose.connect(mongodb_uri);
}

const db = mongoose.connection;
db.on('connected', () => console.log('Data base connected'));
db.on('error', (error) => console.log('error', error));

module.exports = db;
