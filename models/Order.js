const mongoose = require('../utils/db');
const User = require('../models/User');
const Store = require('../models/Store');

const OrderSchema = mongoose.Schema(
  {
    good: { type: mongoose.Schema.Types.ObjectId, ref: Store, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
    address: { type: String, required: true }
  },
  { timestamps: true }
);

const Order = mongoose.model('order', OrderSchema);

module.exports = Order;
