const User = require('./schemas/User');

module.exports = {

  async findUserById(id) {
    const user = await User.findById(id);
    return user;
  },

  async findUserByEmail(email) {
    const user = await User.findOne({ email });
    return user;
  },

  async createUser({ username, email, password }) {
    const userCreate = await User.create({
      username,
      email,
      password,
    });

    return userCreate;
  },

  async updateFieldPassword(id, newValue) {
    try {
      await User.findByIdAndUpdate(id, {
        password: newValue,
      });
    } catch (e) {
      console.log(e);
    }
  },

};
