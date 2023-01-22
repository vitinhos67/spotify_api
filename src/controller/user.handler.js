const User = require('../model/User');
const userService = require('../service/user.service');
const { InvalidArgumentError } = require('../service/errors');

module.exports = {
  async storeUser(req, res, next) {
    try {
      const { username, email, password } = req.body;

      const user = new userService(username, email, password);
      const userCreate = await user.create();

      if (userCreate instanceof Error) {
        return next(userCreate);
      }

      return res.status(201).json(userCreate);
    } catch (e) {
      next(e);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new InvalidArgumentError('Invalid Arguments');
      }

      const user = await userService.loginUser({
        email,
        password,
      });

      console.log(user);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },

  async show(req, res, next) {
    try {
      const users = await User.find();
      return res.status(200).json(users);
    } catch (e) {
      next(e);
    }
  },

  async updateUsername(req, res) {
    try {
      const user = req;
      const { username } = req.body;

      if (!user) {
        throw new InvalidArgumentError('user_invalid');
      }

      const user_model = new userService(user.username, user.email);

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

      const _user = new userService(user.username, user.email, user.password);

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

      const userModel = new userService(user.username, user.email, user.password);

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
