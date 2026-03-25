const Message = require('../models/Message');

module.exports = function(io) {
  io.on('connection', (socket) => {
    console.log('User connected to Chat Socket:', socket.id);

    // Join a specific chat room/session
    // A regular user joins their own sessionId room
    // An Admin joins 'admin_room' and any user's session room they click on
    socket.on('join_room', (data) => {
      const { sessionId, role } = data;
      socket.join(sessionId);
      if (role === 'admin') {
        socket.join('admin_room');
      }
      console.log(`Socket ${socket.id} joined room ${sessionId} as ${role}`);
    });

    // Handle new message
    socket.on('send_message', async (data) => {
      try {
        const { sessionId, content, senderName, senderRole, senderId } = data;
        
        // Save to DB
        const newMessage = await Message.create({
          sessionId,
          content,
          senderName,
          senderRole,
          senderId,
          isReadByAdmin: senderRole === 'admin',
          isReadByUser: senderRole === 'customer'
        });

        // Broadcast to the specific session room
        io.to(sessionId).emit('receive_message', newMessage);

        // If the sender is a customer, notify the admin room about a new message
        if (senderRole === 'customer') {
          io.to('admin_room').emit('new_chat_notification', newMessage);
        }

      } catch (err) {
        console.error('Error saving chat message:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
