const bcrypt = require('bcryptjs');

const User = require('../service/user.service');
const { sign_access_token, sign_reflesh_token, decode } = require('../../functions/jwt');
const { InvalidArgumentError } = require('../service/errors');

module.exports = {
  async store(req, res) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email) {
        return res.status(401).json({
          statusCode: 401,
          statusMessage: 'missing_body',
        });
      }

      const user = await User.findOne({
        username,
        email,
      });

      if (!user) {
        return res.status(401).json({
          statusCode: 401,
          statusMessage: 'user_not_founded',
        });
      }

      const checkPassword = await bcrypt.compare(password, user.password);

      if (checkPassword === false) {
        return res.status(401).json({
          statusCode: 401,
          statusMessage: 'invalid_password',
        });
      }

      const value = {
        id: user.id,
      };

      const access_token = sign_access_token(value);
      const reflesh_token = sign_reflesh_token({ id: user.id });

      return res.status(200).json({
        statusCode: 200,
        statusMessage: 'success',
        data: {
          access_token,
          reflesh_token,
        },
      });
    } catch (e) {
      return res.status(401).json({
        e,
      });
    }
  },
  async reflesh(req, res) {
    try {
      const { reflesh_token } = req.params;
      const payload = decode(reflesh_token);

      const access_token = sign_access_token({ id: payload.payload.id });
      const reflesh_token_renoved = sign_reflesh_token({
        id: payload.payload.id,
      });

      res.status(200).json({
        reflesh_token: reflesh_token_renoved,
        access_token,
      });
    } catch (e) {
      if (e instanceof InvalidArgumentError) {
        return res.status(403).json({
          message: e.message,
        });
      }
    }
  },
};
