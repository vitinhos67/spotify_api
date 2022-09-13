const { InvalidArgumentError } = require('../src/model/errors');

const UserQuery = require('../src/database/query/UserQuery');
const jwt = require('./jwt');

module.exports = {

  async basics(req) {
    const { authorization } = req.headers;
    const { track_id } = req.query;

    const [, token] = authorization.split(' ');

    if (!token) {
      throw new InvalidArgumentError('Token not provided');
    }
    const payload = jwt.verify(token);

    const user = await UserQuery.findUserById(payload.id);

    if (!user) {
      throw new InvalidArgumentError('User not find.');
    }

    return {
      user,
      track_id,
    };
  },

};
