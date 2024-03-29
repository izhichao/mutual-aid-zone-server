const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/email');
const genPassword = require('../utils/cryp');
const randomString = require('../utils/randomString');

let codeMap = new Map();
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
        process.env.SECURT_KEY,
        { expiresIn: '12h' }
      );
      user[0].token = token;
      return user[0];
    }
  }
  static async getCode(body) {
    const { email } = body;
    const oldUser = await User.find({ email });
    if (oldUser.length) {
      return '该邮箱已被使用！';
    }
    const code = randomString(6);
    codeMap.set(email, code);
    sendMail({
      email,
      title: '注册验证码',
      text: `验证码：${code}`
    });
    return '发送成功';
  }

  static async register(userData) {
    let { username, phone, email, password, code } = userData;
    if (code !== codeMap.get(email)) {
      return '验证码错误！';
    }
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
    const { userId, url, protocol } = body;
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

  static async forgetPassword(userData) {
    let { email } = userData;
    // 随机密码
    let newPassword = randomString(10);
    // 加密密码
    let password = genPassword(newPassword);
    const user = await User.findOneAndUpdate({ email }, { password });
    if (user) {
      sendMail({
        email,
        title: '您的密码已重置，请使用新密码进行登录！',
        text: `新密码：${newPassword}`
      });
      return '新密码已发送至邮箱！';
    } else {
      return '邮箱不存在，请先注册！';
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
