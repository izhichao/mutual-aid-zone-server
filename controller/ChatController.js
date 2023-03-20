const Chat = require('../models/Chat');

class ChatController {
  static async getChats() {
    const chats = await Chat.find();
    return chats;
  }

  // 用户聊天列表
  static async getUserChats(body, query) {}

  // 用户聊天记录
  static async getPastChats(body) {}

  static async deleteChat(body) {

  }

  static async createChat(message) {
    await Chat.create(message);
  }
}

module.exports = ChatController;
