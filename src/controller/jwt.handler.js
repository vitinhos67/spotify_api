const bcrypt = require('bcryptjs');

const User = require('../database/schemas/User');
const { sign } = require('../../functions/jwt');

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

      const token = sign(value);

      return res.status(200).json({
        statusCode: 200,
        statusMessage: 'success',
        data: {
          token,
        },

      });
    } catch (e) {
      return res.status(401).json({
        e,
      });
    }
  },
};
