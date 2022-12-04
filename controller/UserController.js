const User = require('../models/User');
const jwt = require('jsonwebtoken');
const genPassword = require('../utils/cryp');
class UserController {
  static async login(userData) {
    let { username, password } = userData;
    password = genPassword(password);
    const user = await User.find({ username, password }).lean();
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
      user[0].token = token;
      return user[0];
    }
  }

  static async register(userData) {
    let { username, phone, email, password } = userData;
    let role = 0;
    password = genPassword(password);
    const oldUser = await User.find({ username });
    if (oldUser.length) {
      return '用户名已存在';
    }
    if (username === 'admin') {
      role = 1;
    }
    User.create({ username, phone, email, password, role });
    return '注册成功';
  }

  static async getUsers() {
    const users = await User.find({});
    return users;
  }

  static async getUser(body, query) {
    const { userId, url,protocol } = body;
    const { _id } = query;
    let user = {};
    // 传入_id时，查询该用户的信息；不传入时，查询当前登录用户的信息
    if (_id) {
      user = await User.findById(_id);
    } else {
      user = await User.findById(userId);
    }
    if (user?.avatar.startsWith('/')) {
      user.avatar = `${protocol}://${url}${user.avatar}`;
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
    let { _id, userId, username, phone, email, address, avatar, balance, role, password } = userData;
    if (_id) {
      userId = _id;
    } else {
      _id = userId;
    }
    const oldUser = await User.find({ username }).lean();
    if (oldUser.length && oldUser[0]._id.toString() !== _id) {
      return '用户名已存在';
    }
    const newUserData = { username, phone, email };
    if (address) {
      newUserData.address = address;
    }
    if (avatar) {
      avatar = `/images/${avatar}`;
      newUserData.avatar = avatar;
    }
    if (balance) {
      newUserData.balance = balance;
    }
    if (role === 0 || role === 1) {
      newUserData.role = role;
    }
    if (password) {
      password = genPassword(password);
      newUserData.password = password;
    }

    await User.findOneAndUpdate({ _id: userId }, newUserData, { new: true });
    return '修改成功';
  }

  static async deleteUser(userData) {
    let { _id } = userData;
    await User.findOneAndDelete({ _id });
    return '删除成功';
  }
}

module.exports = UserController;
