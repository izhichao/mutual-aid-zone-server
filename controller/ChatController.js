const Chat = require('../models/Chat');

class ChatController {
  static async getChats(body, query) {}

  static async getUserChats(body, query) {}

  static async getPastChats(body) {}

  static async createChat(message) {
    await Chat.create(message);
  }
}

module.exports = ChatController;
