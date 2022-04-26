const validator = require('validator');
const bcryptjs = require('bcryptjs');

const { verify } = require('../../functions/jwt');

const User = require('../model/User');

module.exports = {
  async store(req, res) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(401).json({
          message_error: 'need_all_param',
        });
      }

      if (!validator.isEmail(email)) {
        return res.status(401).json({
          message_error: 'format_invalid_email',
        });
      }

      const user = await User.findOne({ email });

      if (user) {
        return res.status(401).json({
          message: 'email_already_in_use',
        });
      }

      if (password <= 3 || password >= 50) {
        return res.status(401).json({
          message: 'format_invalid_password',
          format: 'between in 3 to 50 characters',
        });
      }

      const salt = bcryptjs.genSaltSync(10);
      const hash = bcryptjs.hashSync(password, salt);

      const userCreate = await User.create({
        username,
        email,
        password: hash,
      });

      return res.status(200).json({
        status: 200,
        method: 'post',
        user: userCreate,
      });
    } catch (e) {
      return res.status(401).json({
        e,
      });
    }
  },

  async show(req, res) {
    try {
      const users = await User.find();

      return res.status(200).json({
        users,
      });
    } catch (e) {
      console.log(e);
    }
  },

  async updateUsername(req, res) {
    try {
      const { authorization } = req.headers;
      const { username } = req.body;

      if (!authorization) {
        return res.status(401).json({
          status: 401,
          statusMessage: 'not_header_authorization',

        });
      }

      if (!username) {
        return res.status(401).json({
          status: 401,
          statusMessage: 'undefined_username',

        });
      }

      const [, token] = authorization.split(' ');

      const decryptUser = verify(token);

      if (!decryptUser) {
        return res.status(401).json({
          statusCode: 401,
          status_message: 'user_not_find',
        });
      }

      const user = await User.findOne({ id: decryptUser.id });

      if (!user) {
        return res.status(401).json({
          statusCode: 401,
          status_message: 'user_invalid',
        });
      }

      if (user.username === username) {
        return res.status(401).json({
          statusCode: 401,
          status_message: 'username_already_in_use',
        });
      }

      await User.findOneAndUpdate({ email: user.email }, {
        username,
      });

      return res.status(200).json({
        statusCode: 200,
        statusMessage: 'user_update_successfully',
        old_username: user.username,
        data: {
          new_username: username,

        },

      });
    } catch (e) {
      res.status(401).json({
        statusCode: 401,
        statusMessage: 'internal_error',
        data: e,
      });
    }
  },

  async updateEmail(req, res) {
    try {
      const { authorization } = req.headers;
      const { email } = req.body;

      if (!authorization) {
        return res.status(401).json({
          status: 401,
          statusMessage: 'not_header_authorization',

        });
      }

      if (!email) {
        return res.status(401).json({
          status: 401,
          statusMessage: 'undefined_email',

        });
      }

      const [, token] = authorization.split(' ');

      const decryptUser = verify(token);

      if (!decryptUser) {
        return res.status(401).json({
          statusCode: 401,
          status_message: 'user_not_find',
        });
      }

      const user = await User.findOne({ id: decryptUser.id });

      if (!user) {
        return res.status(401).json({
          statusCode: 401,
          status_message: 'user_invalid',
        });
      }

      if (user.email === email) {
        return res.status(401).json({
          statusCode: 401,
          status_message: 'email_address_already_registered',
        });
      }

      const checkIfEmailIsUse = await User.findOne({
        email,
      });

      if (checkIfEmailIsUse) {
        return res.status(401).json({
          statusCode: 401,
          statusMessage: 'email_already_in_use',

        });
      }

      if (!validator.isEmail(email)) {
        return res.status(401).json({
          statusCode: 401,
          statusMessage: 'email_not_supported',

        });
      }

      await User.findOneAndUpdate({ email: user.email }, {
        email,
      });

      return res.status(200).json({
        statusCode: 200,
        statusMessage: 'user_update_successfully',
        old_email: user.email,
        data: {
          new_email: email,

        },

      });
    } catch (e) {
      res.status(401).json({
        statusCode: 401,
        statusMessage: 'internal_error',
        data: e,
      });
    }
  },

  async updatePassword(req, res) {
    const { authorization } = req.headers;
    const { password, new_password, confirm_password } = req.body;

    if (!authorization) {
      return res.status(401).json({
        status: 401,
        statusMessage: 'not_header_authorization',

      });
    }

    if (!password || !new_password || !confirm_password) {
      return res.status(401).json({
        status: 401,
        statusMessage: 'values_undefined',
        prop: [
          'password',
          'new_password',
          'confirm_password',
        ],
        body: {
          password,
          new_password,
          confirm_password,
        },
      });
    }

    const [, token] = authorization.split(' ');

    const decryptUser = verify(token);

    if (!decryptUser) {
      return res.status(401).json({
        statusCode: 401,
        status_message: 'user_not_find',
      });
    }

    const user = await User.findById(decryptUser.id);

    if (!user) {
      return res.status(401).json({
        status: 401,
        statusMessage: 'not_user',
        data: {
          user,
        },
      });
    }

    const decryptPassword = bcryptjs.compareSync(password, user.password);
    console.log(decryptPassword);
    if (!decryptPassword) {
      return res.status(401).json({
        status: 401,
        statusMessage: 'password_is_invalid',
      });
    }

    if (confirm_password !== new_password) {
      return res.status(401).json({
        status: 401,
        statusMessage: 'different_passwords',
      });
    }

    const salt = bcryptjs.genSaltSync(10);
    const hash = await bcryptjs.hash(new_password, salt);

    const updatePassword = await User.findByIdAndUpdate(user.id, {
      password: hash,
    });

    return res.status(200).json({
      statusCode: 200,
      statusMessage: 'password_update_successfully',
      data: {
        old_password: user.password,
        new_password: updatePassword.password,
      },
    });
  },

};
