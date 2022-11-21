const { TokenExpiredError } = require('jsonwebtoken');
const { InvalidArgumentError } = require('../model/errors');
const UserQuery = require('../database/query/UserQuery');

const { verify } = require('../../functions/jwt');
const generate_reflesh_token = require('../../functions/generate.reflesh.token');

module.exports = {

  async basics(req, res, next) {
    try {
      const { authorization } = req.headers;
      const { reflesh_token } = req.body;

      if (!authorization || !reflesh_token) {
        return res.status(401).json({
          message: 'not_authorized',
        });
      }

      const [, token] = authorization.split(' ');

      if (!token) {
        throw new InvalidArgumentError('Token not provided');
      }
      const verify_token = verify(token);

      if (verify_token instanceof TokenExpiredError) {
        const user = await generate_reflesh_token(reflesh_token);

        if (user instanceof InvalidArgumentError) {
          throw new InvalidArgumentError(user.message);
        }

        req.user = user;

        return next();
      }

      const user = await UserQuery.findUserById(verify_token.id);

      if (!user) {
        throw new InvalidArgumentError('User not find.');
      }

      req.user = user;
      next();
    } catch (e) {
      if (e instanceof InvalidArgumentError) {
        return res.status(403).json({
          message: e.message,
          statusCode: 403,
        });
      }
    }
  },

};
