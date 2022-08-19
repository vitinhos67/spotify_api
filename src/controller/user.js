const validator = require('validator');
const bcryptjs = require('bcryptjs');

const { verify } = require('../../functions/jwt');

const User = require('../database/schemas/User');
const modelUser = require('../model/User');
const { InvalidArgumentError } = require('../model/errors');

module.exports = {
  async store(req, res) {
    try {
      const { username, email, password } = req.body;
      const user = new modelUser(username, email, password);
      const userCreate = await user.create();

      return res.status(200).json({ userCreate });
    } catch (e) {
      if (e instanceof InvalidArgumentError) {
        return res.status(403).json({
          e: e.message,
        });
      }

      return res.status(400).json({
        error: e,
        e: e.message,
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
        return res.status(400).json({
          status: 400,
          statusMessage: 'not_header_authorization',

        });
      }

      if (!username) {
        return res.status(400).json({
          status: 400,
          statusMessage: 'undefined_username',

        });
      }

      const [, token] = authorization.split(' ');

      const decryptUser = verify(token);

      if (!decryptUser) {
        return res.status(400).json({
          statusCode: 400,
          status_message: 'user_not_find',
        });
      }

      const user = await User.findOne({ id: decryptUser.id });

      if (!user) {
        return res.status(400).json({
          statusCode: 400,
          status_message: 'user_invalid',
        });
      }

      if (user.username === username) {
        return res.status(400).json({
          statusCode: 400,
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
      res.status(400).json({
        statusCode: 400,
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
        return res.status(400).json({
          status: 400,
          statusMessage: 'not_header_authorization',

        });
      }

      if (!email) {
        return res.status(400).json({
          status: 400,
          statusMessage: 'undefined_email',

        });
      }

      const [, token] = authorization.split(' ');

      const decryptUser = verify(token);

      if (!decryptUser) {
        return res.status(400).json({
          statusCode: 400,
          status_message: 'user_not_find',
        });
      }

      const user = await User.findOne({ id: decryptUser.id });

      if (!user) {
        return res.status(400).json({
          statusCode: 400,
          status_message: 'user_invalid',
        });
      }

      if (user.email === email) {
        return res.status(400).json({
          statusCode: 400,
          status_message: 'email_address_already_registered',
        });
      }

      const checkIfEmailIsUse = await User.findOne({
        email,
      });

      if (checkIfEmailIsUse) {
        return res.status(400).json({
          statusCode: 400,
          statusMessage: 'email_already_in_use',

        });
      }

      if (!validator.isEmail(email)) {
        return res.status(400).json({
          statusCode: 400,
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
      res.status(400).json({
        statusCode: 400,
        statusMessage: 'internal_error',
        data: e,
      });
    }
  },

  async updatePassword(req, res) {
    const { authorization } = req.headers;
    const { password, new_password, confirm_password } = req.body;

    if (!authorization) {
      return res.status(400).json({
        status: 400,
        statusMessage: 'not_header_authorization',

      });
    }

    if (!password || !new_password || !confirm_password) {
      return res.status(400).json({
        status: 400,
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
      return res.status(400).json({
        statusCode: 400,
        status_message: 'user_not_find',
      });
    }

    const user = await User.findById(decryptUser.id);

    if (!user) {
      return res.status(400).json({
        status: 400,
        statusMessage: 'not_user',
        data: {
          user,
        },
      });
    }

    const decryptPassword = bcryptjs.compareSync(password, user.password);
    console.log(decryptPassword);
    if (!decryptPassword) {
      return res.status(400).json({
        status: 400,
        statusMessage: 'password_is_invalid',
      });
    }

    if (confirm_password !== new_password) {
      return res.status(400).json({
        status: 400,
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
