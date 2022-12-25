const jwt = require('jsonwebtoken');
const { InvalidArgumentError } = require('../src/service/errors');

const credentials = require('../config/credentials').configs;

const {
  json_web_secret,
  expiresIn_access_token,
  expiresIn_reflesh_token,
  reflesh_token_secret,
} = credentials;
module.exports = {
  sign_access_token(payload) {
    return jwt.sign(payload, json_web_secret, {
      expiresIn: expiresIn_access_token,
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
      const data = jwt.verify(token, json_web_secret);

      if (!data) {
        throw new InvalidArgumentError('Error: "User not find"');
      }

      return data;
    } catch (e) {
      return e;
    }
  },

  sign_reflesh_token(payload) {
    return jwt.sign(payload, reflesh_token_secret, {
      expiresIn: expiresIn_reflesh_token,
    });
  },
};
