const Store = require('../db/models/Store');
const User = require('../db/models/User');

class StoreController {
  static getGoods = async (body) => {
    const { url } = body;
    const goods = await Store.find();
    goods.forEach((item) => {
      item.img = `http://${url}${item.img}`;
    });
    return goods;
  };

  static createGood = async (goodData) => {
    let { name, price, stock, img } = goodData;
    img = `/images/${img}`;
    Store.create({ name, price, stock, img });
    return '添加成功';
  };

  static getBalance = async (body) => {
    const { userId } = body;
    const user = await User.findById(userId);
    return { balance: user.balance };
  };

  static recharge = async (body) => {
    const { userId, amount } = body;
    const { balance: oldBalance } = await this.getBalance(body);
    const balance = oldBalance + amount;
    const user = await User.findOneAndUpdate({ _id: userId }, { balance }, { new: true });
    return { balance: user.balance };
  };
}

module.exports = StoreController;
