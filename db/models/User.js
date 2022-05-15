const mongoose = require('../db');

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: String,
    balance: {
      type: Number,
      default: 0
    },
    avatar: {
      type: String,
      default: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
    }
  },
  { timestamps: true }
);

const User = mongoose.model('user', UserSchema);

module.exports = User;
