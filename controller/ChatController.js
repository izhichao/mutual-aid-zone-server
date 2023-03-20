const Chat = require('../models/Chat');
const User = require('../models/User');

class ChatController {
  static async getChats() {
    const chats = await Chat.find();
    return chats;
  }

  // 用户聊天列表
  static async getUserChats(body) {
    const { userId, url, protocol } = body;
    const filter = { $or: [{ sender: userId }, { receiver: userId }] };
    const chats = await Chat.find(filter).sort({ createdAt: -1 }).lean();

    // 获取每个用户最新一条记录
    const resultObj = {};
    chats.forEach((item) => {
      let target = item.sender;
      if (item.sender.toString() === userId) {
        target = item.receiver;
      }
      if (!resultObj[target]) {
        resultObj[target] = item;
      }
    });

    // 将结果转换为数组，并获取目标用户的头像、名字等信息
    const resultArr = [];
    for (const key in resultObj) {
      const user = await User.findById(key);
      resultObj[key].target = key;
      resultObj[key].username = user.username;
      if (user?.avatar.startsWith('/')) {
        user.avatar = `${protocol}://${url}${user.avatar}`;
      }
      resultObj[key].avatar = user.avatar;

      resultArr.push(resultObj[key]);
    }
    return resultArr;
  }

  // 用户聊天记录
  static async getPastChats(body) {}

  static async deleteChat(body) {
    const { _id } = body;
    await Chat.findByIdAndUpdate(_id, { delete: true });
    return '删除成功';
  }

  static async createChat(message) {
    await Chat.create(message);
  }
}

module.exports = ChatController;
