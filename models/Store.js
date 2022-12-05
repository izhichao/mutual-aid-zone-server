const mongoose = require('../utils/db');

const StoreSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    img: { type: String, required: true }
  },
  { timestamps: true }
);

const Store = mongoose.model('store', StoreSchema);

module.exports = Store;
