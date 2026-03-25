const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Admin only routes
// Get all recent active sessions
router.get('/sessions', async (req, res) => {
  try {
    // Get distinct session IDs with their latest message
    const sessions = await Message.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$sessionId",
          lastMessage: { $first: "$content" },
          senderName: { $first: "$senderName" },
          timestamp: { $first: "$createdAt" },
          unreadCount: {
            $sum: { $cond: [{ $eq: ["$isReadByAdmin", false] }, 1, 0] }
          }
        }
      },
      { $sort: { timestamp: -1 } }
    ]);
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching sessions' });
  }
});

// Get messages for a specific session ID
router.get('/:sessionId', async (req, res) => {
  try {
    const messages = await Message.find({ sessionId: req.params.sessionId }).sort({ createdAt: 1 });
    
    // If admin is viewing, mark as read by admin
    // In a real app we'd verify the admin role middleware here.
    await Message.updateMany(
      { sessionId: req.params.sessionId, senderRole: 'customer' },
      { $set: { isReadByAdmin: true } }
    );
    
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching messages' });
  }
});

module.exports = router;
