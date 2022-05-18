const Store = require('../db/models/Store');
const User = require('../db/models/User');

class StoreController {
  static getBalance = async (body) => {
    const { userId } = body;
    const user = await User.findById(userId);
    return { balance: user.balance };
  };

  static recharge = async (body) => {
    const { userId, amount } = body;
    const { balance: oldBalance } = await this.getBalance(body);
    const balance = oldBalance + amount;
    await User.findOneAndUpdate({ _id: userId }, { balance });
    return '充值成功';
  };
}

module.exports = StoreController;
