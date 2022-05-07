const mongoose = require('mongoose');
const credentials = require('../config/credentials');

const { configs } = credentials;

mongoose.connect(configs.mongodb_uri);

const db = mongoose.connection;
db.on('connected', () => console.log('Data base connected'));
db.on('error', (error) => console.log('error', error));

module.exports = db;
