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
    console.log(this);
    if (!this._username) throw new InvalidArgumentError('username not valid');

    if (!this.checkEmail()) {
      throw new InvalidArgumentError('Email not valid');
    }

    const password = this.checkPasswordAndHash();

    const UserAlreadyExist = await userQuery.findUserByEmail(this.email);

    if (UserAlreadyExist) {
      throw new InvalidArgumentError('User Already Exist.');
    }
    console.log(password, UserAlreadyExist);
    const user = await userQuery.createUser({
      username: this._username,
      email: this._email,
      password,
    });

    return user;
  }
}

module.exports = User;
