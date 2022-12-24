const Order = require('../models/Order');

class OrderController {
  static async getOrders(userId) {
    const orders = await Order.findOne({ user: userId }).sort({ createdAt: -1 });
    return orders;
  }
}

module.exports = OrderController;
