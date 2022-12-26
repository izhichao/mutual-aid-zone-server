const Ticket = require('../models/Ticket');

class TicketController {
  static async getTickets(body) {
    const { userId } = body;
    const tickets = await Ticket.find({ user: userId }).sort({ createdAt: -1 });
    return tickets;
  }

  static async createTicket(body) {
    const { userId, question } = body;
    await Ticket.create({ user: userId, question });
    return '发送成功';
  }
}

module.exports = TicketController;
