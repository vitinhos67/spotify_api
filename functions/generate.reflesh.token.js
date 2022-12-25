const axios = require('axios');
const { decode } = require('./jwt');
const { configs } = require('../config/credentials');
const UserQuery = require('../src/database/query/UserQuery');
const { InvalidArgumentError } = require('../src/service/errors');

const { endpoint, port } = configs;

/**
 * @param {reflesh_token} reflesh_token
 *
 * it just receives reflesh_token to generate a new valid token
 * for the user and returns the already validated userGet
 *
 */

module.exports = async (reflesh_token) => {
  try {
    const decoded_old_reflesh_token = decode(reflesh_token);

    if (decoded_old_reflesh_token instanceof InvalidArgumentError) {
      throw new InvalidArgumentError('reflesh_token invalid');
    }

    const url = `${endpoint}:${port}/auth/reflesh_token/${reflesh_token}`;

    const response = await axios({
      method: 'post',
      url,
    });

    const decoded = decode(response.data.reflesh_token);

    if (decoded instanceof InvalidArgumentError) {
      throw new InvalidArgumentError('reflesh_token invalid');
    }

    const user = await UserQuery.findUserById(decoded.payload.id);

    if (!user) {
      throw new InvalidArgumentError('reflesh_token: User not find.');
    }
    return user;
  } catch (e) {
    return e;
  }
};
