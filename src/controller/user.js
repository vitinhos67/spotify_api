const validator = require('validator');
const bcryptjs = require('bcryptjs');

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

      const salt = bcryptjs.genSaltSync();
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

};
