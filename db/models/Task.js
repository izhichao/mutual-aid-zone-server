const mongoose = require('../db');

const TaskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    content: {
      type: Number,
      required: true
    },
    imgs: Array,
    setter: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    getter: mongoose.Schema.Types.ObjectId,
    status: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const Task = mongoose.model('task', TaskSchema);

module.exports = Task;
