const { InvalidArgumentError } = require('../model/errors');

const UserQuery = require('../database/query/UserQuery');
const jwt = require('../../functions/jwt');

module.exports = {

  async basics(req, res, next) {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({
        message: 'not_authorized',
      });
    }

    const [, token] = authorization.split(' ');

    if (!token) {
      throw new InvalidArgumentError('Token not provided');
    }
    const payload = jwt.verify(token);

    const user = await UserQuery.findUserById(payload.id);

    if (!user) {
      throw new InvalidArgumentError('User not find.');
    }

    req.user = user;

    next();
  },

};
