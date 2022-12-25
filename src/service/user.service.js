const validator = require('validator');
const bcryptjs = require('bcryptjs');
const userQuery = require('../database/query/UserQuery');
const { InvalidArgumentError, ValueAlreadyExists } = require('./errors');
const jwt = require('../../functions/jwt');

/**
 * @typedef {Object} User
 * @property {String} username
 * @property {String} email
 * @property {String} password
 *
 * The class responsible for manipulation User as Add, Remover, Update and make checkout
 * of Users
 *
 */

class User {
  constructor(username, email, password) {
    this._username = username;
    this._email = email;
    this._password = password;
  }

  _checkEmail() {
    if (!this._email) throw new InvalidArgumentError('Email not defined');
    return validator.isEmail(this._email);
  }

  _checkPasswordAndHash() {
    if (!this._password) throw new InvalidArgumentError('password not valid');

    if (this._password.length <= 3 || this._password.length >= 50) {
      throw new InvalidArgumentError('password not valid');
    }

    if (typeof this._password !== 'string') {
      throw new SyntaxError('The api does not accept data other than a string');
    }

    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(this._password, salt);
    return hash;
  }

  async create() {
    try {
      if (!this._username) throw new InvalidArgumentError('username not valid');

      if (!this._checkEmail()) {
        throw new InvalidArgumentError('Email not valid');
      }

      const password = this._checkPasswordAndHash();

      const UserAlreadyExist = await userQuery.findUserByEmail(this._email);

      if (UserAlreadyExist) {
        throw new ValueAlreadyExists('User Already Exist.');
      }

      const user = await userQuery.createUser({
        username: this._username,
        email: this._email,
        password,
      });

      const auth = {
        access_token: jwt.sign_access_token({ id: user.id }),
        reflesh_token: jwt.sign_reflesh_token({ id: user.id }),
      };

      return {
        user,
        ...auth,
      };
    } catch (e) {
      return e;
    }
  }

  async updatePassword(id, { password, new_password, confirm_password }) {
    if (!this._password || !new_password || !confirm_password) {
      throw new InvalidArgumentError('Check Values. Necessity password, new_password, confirm_password');
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

  async updateEmail(email) {
    if (!email) {
      throw new InvalidArgumentError('Email not valid');
    }

    const email_in_use = await userQuery.findUserByEmail(email);

    if (email_in_use) {
      throw new InvalidArgumentError('Email already in use');
    }

    if (!validator.isEmail(email)) {
      throw new InvalidArgumentError('Email not valid');
    }

    const user = await userQuery.findUserByEmail(this._email);

    if (email === user.email) {
      throw new InvalidArgumentError('Email in use.');
    }

    await userQuery.updateFieldEmail(user.id, email);
  }

  async updateUsername({ id }, username) {
    if (typeof username !== 'string') {
      throw new InvalidArgumentError('Insert valid value.');
    }

    if (!username || username === this._username) {
      throw new InvalidArgumentError('name undefined or invalid name');
    }

    return userQuery.updateFieldUsername(id, username);
  }
}

module.exports = User;
