const mongoose = require('../utils/db');
const User = require('../models/User');

const TicketSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: User },
    question: { type: String, required: true },
    answer: { type: String }
  },
  { timestamps: true }
);
const Ticket = mongoose.model('ticket', TicketSchema);
module.exports = Ticket;
