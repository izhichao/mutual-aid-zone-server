const mongoose = require('../utils/db');
const User = require('../models/User');
const Store = require('../models/Store');

const OrderSchema = mongoose.Schema(
  {
    good: { type: String, required: true },
    price: { type: String, required: true },
    img: { type: String, required: true },
    address: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
    status: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Order = mongoose.model('order', OrderSchema);

module.exports = Order;
