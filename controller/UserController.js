const User = require('../db/models/User');
const jwt = require('jsonwebtoken');
const genPassword = require('../utils/cryp');
class UserController {
  static async login(userData) {
    let { username, password } = userData;
    password = genPassword(password);
    const user = await User.find({ username, password });
    if (user.length === 0) {
      return '用户名或密码错误';
    } else {
      const token = jwt.sign(
        {
          userId: user[0]._id
        },
        'IHS9794Nis',
        { expiresIn: '12h' }
      );
      return { token };
    }
  }

  static async register(userData) {
    let { username, phone, email, password } = userData;
    password = genPassword(password);
    const oldUser = await User.find({ username });
    if (oldUser.length) {
      return '用户名已存在';
    }
    User.create({ username, phone, email, password });
    return '注册成功';
  }

  static async getUser(body) {
    const { userId, url } = body;
    const user = await User.findById(userId);
    if (user?.avatar.startsWith('/')) {
      user.avatar = `http://${url}${user.avatar}`;
    }
    return user;
  }

  static async changePassword(userData) {
    let { userId, oldPassword, password } = userData;
    oldPassword = genPassword(oldPassword);
    password = genPassword(password);
    const user = await User.findOneAndUpdate({ _id: userId, password: oldPassword }, { password }, { new: true });
    if (user) {
      return '修改成功';
    } else {
      return '原密码错误';
    }
  }

  static async editUser(userData) {
    let { userId, username, phone, email, address, avatar } = userData;
    const newUserData = { username, phone, email };
    if (address) {
      newUserData.address = address;
    }

    if (avatar) {
      avatar = `/images/${avatar}`;
      newUserData.avatar = avatar;
    }

    await User.findOneAndUpdate({ _id: userId }, newUserData, { new: true });
    return '修改成功';
  }
}

module.exports = UserController;
