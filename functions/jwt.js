const jwt = require('jsonwebtoken');
const { InvalidArgumentError } = require('../src/model/errors');

const credentials = require('../config/credentials').configs;

const secret = credentials.json_web_secret;

module.exports = {

  sign_access_token(payload) {
    return jwt.sign(payload, secret, {
      expiresIn: process.env.expiresIn_access_token,
    });
  },

  decode(token) {
    try {
      const data = jwt.decode(token, { complete: true });

      if (!data) {
        throw new InvalidArgumentError('Error: "User not find"');
      }

      return data;
    } catch (e) {
      return e;
    }
  },

  verify(token) {
    try {
      const data = jwt.verify(token, secret);

      if (!data) {
        throw new InvalidArgumentError('Error: "User not find"');
      }

      return data;
    } catch (e) {
      return e;
    }
  },

  sign_reflesh_token(payload) {
    return jwt.sign(payload, process.env.json_web_reflesh_token, {
      expiresIn: process.env.expiresIn_reflesh_token,
    });
  },

};
