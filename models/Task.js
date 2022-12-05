const mongoose = require('../utils/db');
const User = require('../models/User');

const TaskSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    content: { type: String, required: true },
    imgs: Array,
    setter: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
    getter: { type: mongoose.Schema.Types.ObjectId, ref: User },
    status: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Task = mongoose.model('task', TaskSchema);

module.exports = Task;
