const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {
  createNotification,
  getUserNotifications,
  markAsRead
} = require('../controllers/notification.controller');

router.post('/', auth, createNotification);             // create notification
router.get('/', auth, getUserNotifications);            // get all for logged-in user
router.put('/:id/read', auth, markAsRead);              // mark one as read

module.exports = router;
