const Order = require('../models/Order');

class OrderController {
  static async getOrders(body, query) {
    const { userId, url, protocol } = body;
    const { type } = query;
    let selectObj = { user: userId };
    if (type === 'all') {
      selectObj = {};
    }
    const orders = await Order.find(selectObj).sort({ createdAt: -1 }).populate('user', 'username').lean();
    orders.forEach((item) => {
      item.img = `${protocol}://${url}${item.img}`;
      item.user = item.user.username;
    });
    return orders;
  }

  static async getOrder(query) {
    const { _id } = query;
    const order = await Order.findById(_id).populate('user', 'username').lean();
    order.user = order.user.username;
    return order;
  }

  static async editOrder(body) {
    const { _id, address, express } = body;
    let updateObj = { address };
    if (express) {
      updateObj = { address, express, status: 1 };
    }
    await Order.findByIdAndUpdate(_id, updateObj);
    return '编辑成功';
  }

  static async finishOrder(body) {
    const { _id } = body;
    await Order.findByIdAndUpdate(_id, { status: 2 });
    return '确认收货成功';
  }
}

module.exports = OrderController;
