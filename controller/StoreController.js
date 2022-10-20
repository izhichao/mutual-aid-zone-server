const Store = require('../db/models/Store');
const User = require('../db/models/User');

class StoreController {
  static async getGoods(body) {
    const { url,protocol } = body;
    const goods = await Store.find();
    goods.forEach((item) => {
      item.img = `${protocol}://${url}${item.img}`;
    });
    return goods;
  }

  static async createGood(goodData) {
    let { name, price, stock, img } = goodData;
    img = `/images/${img}`;
    Store.create({ name, price, stock, img });
    return '添加成功';
  }

  static async editGood(goodData) {
    let { _id, name, price, stock, img } = goodData;
    const newGoodData = { name, price, stock };
    if (img) {
      newGoodData.img = `/images/${img}`;
    }
    await Store.findByIdAndUpdate(_id, newGoodData);
    return '修改成功';
  }

  static async deleteGood(body) {
    const { _id } = body;
    await Store.findByIdAndDelete(_id);
    return '删除成功';
  }

  static async getGood(body, query) {
    const { url,protocol } = body;
    const { _id } = query;
    const good = await Store.findById(_id).lean();
    good.img = `${protocol}://${url}${good.img}`;
    return good;
  }

  static async exchangeGood(body) {
    const { userId, _id } = body;
    const { balance } = await this.getBalance(body);
    const { price, stock } = await Store.findById(_id);
    if (stock <= 0) {
      return '库存不足';
    } else if (balance < price) {
      return '余额不足';
    } else {
      await User.findOneAndUpdate({ _id: userId }, { balance: balance - price }, { new: true });
      await Store.findOneAndUpdate({ _id }, { stock: stock - 1 }, { new: true });
      return '兑换成功';
    }
  }

  static async getBalance(body) {
    const { userId } = body;
    const user = await User.findById(userId);
    return { balance: user.balance };
  }

  static async recharge(body) {
    const { userId, amount } = body;
    const { balance: oldBalance } = await this.getBalance(body);
    const balance = oldBalance + amount;
    const user = await User.findOneAndUpdate({ _id: userId }, { balance }, { new: true });
    return { balance: user.balance };
  }
}

module.exports = StoreController;
