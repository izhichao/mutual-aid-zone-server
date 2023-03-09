const Ticket = require('../models/Ticket');

class TicketController {
  static async getTickets(body) {
    const { userId } = body;
    const tickets = await Ticket.find({ user: userId }).sort({ createdAt: -1 });
    return tickets;
  }

  static async getAllTickets() {
    const tickets = await Ticket.find().sort({ createdAt: -1 }).populate('user admin', 'username');
    return tickets;
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
