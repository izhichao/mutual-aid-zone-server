const mongoose = require('../utils/db');
const User = require('../models/User');

const ChatSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
    content: { type: String, required: true },
    delete: { type: Boolean, default: false }
  },
  { timestamps: true }
);
const Chat = mongoose.model('chat', ChatSchema);

module.exports = Chat;
