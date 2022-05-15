const User = require('../db/models/User');
const jwt = require('jsonwebtoken');

class UserController {
  static async login(userData) {
    const { username, password } = userData;
    const user = await User.find({ username, password });
    if (user.length === 0) {
      return '用户名或密码错误';
    } else {
      const token = jwt.sign(
        {
          _id: user[0]._id
        },
        'IHS9794Nis',
        { expiresIn: '12h' }
      );
      return { token };
    }
  }

  static async register(userData) {
    const { username, phone, email, password } = userData;
    const oldUser = await User.find({ username });
    if (oldUser.length) {
      return '用户名已存在';
    }
    User.create({ username, phone, email, password });
    return '注册成功';
  }
}

module.exports = UserController;
