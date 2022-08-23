const jwt = require('jsonwebtoken');
const { InvalidArgumentError } = require('../src/model/errors');

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
      const user = jwt.verify(token, secret);

      if (!user) {
        throw new InvalidArgumentError('Error: "User not find"');
      }

      return user;
    } catch (err) {
      console.log(err);
    }
  },

};
