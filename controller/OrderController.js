const Order = require('../models/Order');

class OrderController {
  static async getOrders(body) {
    const { userId, url, protocol } = body;

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).lean();
    orders.forEach((item) => {
      item.img = `${protocol}://${url}${item.img}`;
    });
    return orders;
  }
}

module.exports = OrderController;
