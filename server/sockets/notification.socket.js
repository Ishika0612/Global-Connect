const jwt = require('jsonwebtoken');
const Notification = require('../models/Notification');

module.exports = (io) => {
  // Map userId => socketId to track connected users
  const connectedUsers = new Map();

  io.on('connection', (socket) => {
    console.log('🔌 New client connected');

    // User sends JWT token to register
    socket.on('register', (token) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        connectedUsers.set(decoded.id, socket.id);
        socket.join(decoded.id); // Join user-specific room for private emits
        console.log(`✅ User ${decoded.id} registered for notifications`);
      } catch (err) {
        console.error('❌ Invalid token for notifications:', err.message);
      }
    });

    // Optional: handle client-triggered notification creation and sending
    socket.on('send_notification', async ({ toUserId, content, type }) => {
      try {
        const notif = await Notification.create({
          userId: toUserId,
          type,
          content,
        });

        io.to(toUserId).emit('new_notification', notif);
      } catch (err) {
        console.error('❌ Error sending notification:', err.message);
      }
    });

    // Cleanup on disconnect
    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected');
      for (const [userId, sid] of connectedUsers.entries()) {
        if (sid === socket.id) {
          connectedUsers.delete(userId);
          break;
        }
      }
    });
  });
};
