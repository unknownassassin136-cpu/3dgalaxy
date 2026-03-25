// server/models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: {
    type: String,
    required: true, // socket ID for guests, user ID for logged in users
  },
  senderName: {
    type: String,
    required: true, // e.g., "Guest-123", "Pavan", or "Admin"
  },
  senderRole: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  },
  sessionId: {
    type: String,
    required: true, // For grouping conversations. Admin responds to the sessionId.
  },
  content: {
    type: String,
    required: true
  },
  isReadByAdmin: {
    type: Boolean,
    default: false
  },
  isReadByUser: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
