const Notification = require('../models/Notification'); // 👈 Import model
const jwt = require('jsonwebtoken');

const socketHandler = (io) => {
  const connectedUsers = new Map(); // 👈 Keep track of socket IDs

  io.on('connection', (socket) => {
    console.log('✅ New client connected');

    socket.on('register', (token) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        connectedUsers.set(userId, socket.id);
        socket.join(userId);
        console.log(`🔔 User ${userId} joined their room`);
      } catch (err) {
        console.log('❌ Invalid token for socket');
      }
    });

    socket.on('send_notification', async ({ toUserId, content }) => {
      try {
        const notif = await Notification.create({ userId: toUserId, content });

        const socketId = connectedUsers.get(toUserId);
        if (socketId) {
          io.to(socketId).emit('new_notification', notif);
        }
      } catch (err) {
        console.log('❌ Error sending notification:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ Client disconnected');
      for (let [id, sid] of connectedUsers.entries()) {
        if (sid === socket.id) connectedUsers.delete(id);
      }
    });
  });
};

module.exports = socketHandler;
