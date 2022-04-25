/* eslint-disable no-unused-vars */
require('dotenv').config();
const jwt = require('jsonwebtoken');

const credentials = require('../src/config/credentials').configs;

const secret = credentials.json_web_secret;

module.exports = {

  sign(payload) {
    return jwt.sign(payload, secret, {
      expiresIn: '7d',
    });
  },

  decode(token) {
    return jwt.decode(token, { complete: true });
  },

  verify(token) {
    try {
      return jwt.verify(token, secret);
    } catch (err) {
      console.log(err);
    }
  },

};
