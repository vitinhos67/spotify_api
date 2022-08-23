// const bcryptjs = require('bcryptjs');

const { verify } = require('../../functions/jwt');

const User = require('../database/schemas/User');
const modelUser = require('../model/User');
const { InvalidArgumentError } = require('../model/errors');
const UserQuery = require('../database/UserQuery');

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
      console.log(email);

      const [, token] = authorization.split(' ');

      const decryptUser = verify(token);

      const user = await UserQuery.findUserById(decryptUser.id);

      if (!user) {
        return res.status(400).json({
          statusCode: 400,
          status_message: 'user_invalid',
        });
      }

      const _user = new modelUser(user.username, user.email, user.password);

      const update_message = await _user.updateEmail(email);

      return res.status(201).json({
        statusCode: update_message.status_code,
        statusMessage: 'user_update_successfully',
        old_email: user.email,
        data: {
          new_email: email,

        },

      });
    } catch (e) {
      if (e instanceof InvalidArgumentError) {
        return res.status(403).json({
          statusCode: 403,
          statusMessage: 'internal_error',
          data: e.message,
        });
      }

      res.status(500).json({
        statusCode: 500,
        statusMessage: 'internal_error',
        data: e,
      });
    }
  },

  async updatePassword(req, res) {
    try {
      const { authorization } = req.headers;
      const { password, new_password, confirm_password } = req.body;

      if (!authorization) {
        return res.status(400).json({
          status: 400,
          statusMessage: 'not_header_authorization',

        });
      }

      const [, token] = authorization.split(' ');
      const decryptUser = verify(token);

      const userFind = await UserQuery.findUserById(decryptUser.id);

      const user = new modelUser(userFind.username, userFind.email, userFind.password);

      const update = await user.updatePassword(
        userFind.id,
        { password, new_password, confirm_password },
      );

      return res.status(200).json({
        statusCode: 200,
        statusMessage: 'password_update_successfully',
        data: {
          old_password: password,
          new_password,
          confirm_password,
          update,
        },
      });
    } catch (e) {
      if (e instanceof InvalidArgumentError) {
        res.status(403).json({
          e: e.message,
        });
      }
    }
  },

};
