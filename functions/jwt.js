/* eslint-disable no-unused-vars */
require('dotenv').config();
const jwt = require('jsonwebtoken');

const credentials = require('../src/config/credentials').configs;

const secret = credentials.json_web_secret;

module.exports = {

  createToken(payload) {
    return jwt.sign(payload, process.env.JSON_WEB_SECRET, {
      expiresIn: '7d',
    });
  },

  decode(token) {
    return jwt.decode(token, { complete: true });
  },

  verify(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (error, decoded) => {
        if (error) {
          reject(error);
        }

        resolve(decoded);
      });
    });
  },

};
