const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {
  sendMessage,
  getMessages
} = require('../controllers/message.controller');

// Send message
router.post('/', auth, sendMessage);

// Get chat history
router.get('/:sender/:receiver', auth, getMessages);

module.exports = router;
