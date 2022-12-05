const User = require('../database/schemas/User');
const modelUser = require('../model/User');

module.exports = {
  async store(req, res, next) {
    try {
      const { username, email, password } = req.body;
      const user = new modelUser(username, email, password);
      const userCreate = await user.create();

      if (userCreate instanceof Error) {
        return next(userCreate);
      }

      return res.status(204).json({ userCreate });
    } catch (e) {
      next(e);
    }
  },

  async show(req, res, next) {
    try {
      const users = await User.find();
      return res.status(200).json({
        users,
      });
    } catch (e) {
      next(e);
    }
  },

  async updateUsername(req, res) {
    try {
      const user = req;
      const { username } = req.body;

      if (!user) {
        return res.status(400).json({
          statusCode: 400,
          status_message: 'user_invalid',
        });
      }

      const user_model = new modelUser(user.username, user.email);

      await user_model.updateUsername(user, username);
      return res.status(202).json({
        statusCode: 202,
        statusMessage: 'user_update_successfully',
        old_username: user.username,
        data: {
          new_username: username,
        },
      });
    } catch (e) {
      next(e);
    }
  },

  async updateEmail(req, res) {
    try {
      const { user } = req;
      const { email } = req.body;

      const _user = new modelUser(user.username, user.email, user.password);

      await _user.updateEmail(email);

      return res.status(202).json({
        statusCode: 202,
        statusMessage: 'user_update_successfully',
        old_email: user.email,
        data: {
          new_email: email,
        },
      });
    } catch (e) {
      next(e);
    }
  },

  async updatePassword(req, res, next) {
    try {
      const { user } = req;
      const { password, new_password, confirm_password } = req.body;

      const userModel = new modelUser(user.username, user.email, user.password);

      const update = await userModel.updatePassword(user.id, {
        password,
        new_password,
        confirm_password,
      });

      return res.status(202).json({
        statusCode: 202,
        statusMessage: 'password_update_successfully',
        data: {
          old_password: password,
          new_password,
          confirm_password,
          update,
        },
      });
    } catch (e) {
      next(e);
    }
  },
};
