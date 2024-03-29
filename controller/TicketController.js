const Ticket = require('../models/Ticket');

class TicketController {
  static async getTickets(body, query) {
    const { userId } = body;
    const { type } = query;
    let selectObj = { user: userId };
    if (type === 'all') {
      selectObj = {};
    }
    const tickets = await Ticket.find(selectObj)
      .sort({ createdAt: -1 })
      .populate('user admin', 'username')
      .lean();
    tickets.forEach((item) => {
      item.user = item.user.username;
      item.admin = item.admin?.username;
      return item;
    });
    return tickets;
  }

  static async getTicket(query) {
    const { _id } = query;
    const ticket = await Ticket.findById(_id).populate('user admin', 'username').lean();
    ticket.user = ticket.user.username;
    ticket.admin = ticket.admin?.username;
    return ticket;
  }

  static async createTicket(body) {
    const { userId, question } = body;
    await Ticket.create({ user: userId, question });
    return '发送成功';
  }

  static async answerTicket(body) {
    const { userId, answer, _id } = body;
    await Ticket.findByIdAndUpdate(_id, {
      answer,
      admin: userId
    });
    return '回复成功';
  }
}

module.exports = TicketController;
