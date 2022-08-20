const validator = require('validator');
const bcryptjs = require('bcryptjs');
const userQuery = require('../database/UserQuery');
const { InvalidArgumentError } = require('./errors');

class User {
  constructor(username, email, password) {
    this._username = username;
    this._email = email;
    this._password = password;
  }

  checkEmail() {
    if (!this._email) throw new InvalidArgumentError('Email not defined');

    return validator.isEmail(this._email);
  }

  checkPasswordAndHash() {
    if (!this._password) throw new InvalidArgumentError('password not valid');

    if (this._password.length <= 3 || this._password.length >= 50) {
      throw new InvalidArgumentError('password not valid');
    }

    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(this._password, salt);

    return hash;
  }

  async create() {
    if (!this._username) throw new InvalidArgumentError('username not valid');

    if (!this.checkEmail()) {
      throw new InvalidArgumentError('Email not valid');
    }

    const password = this.checkPasswordAndHash();

    const UserAlreadyExist = await userQuery.findUserByEmail(this.email);

    if (UserAlreadyExist) {
      throw new InvalidArgumentError('User Already Exist.');
    }

    const user = await userQuery.createUser({
      username: this._username,
      email: this._email,
      password,
    });

    return user;
  }

  async updatePassword(id, { password, new_password, confirm_password }) {
    if (!this._password || !new_password || !confirm_password) {
      throw new InvalidArgumentError({
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

    const decryptPassword = await bcryptjs.compare(password, this._password);

    if (!decryptPassword) {
      throw new InvalidArgumentError('Password invalid.');
    }

    if (new_password !== confirm_password) {
      throw new InvalidArgumentError('Password_not_accept');
    }

    const salt = bcryptjs.genSaltSync(10);
    const hash = await bcryptjs.hash(new_password, salt);

    await userQuery.updateFieldPassword(id, hash);

    return {
      messageStatus: 'success',
    };
  }
}

module.exports = User;
