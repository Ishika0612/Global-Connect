const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');

const {
  getUserProfile,
  updateUserProfile,
  sendConnectionRequest,
  acceptConnectionRequest,
  getAllUsers, // ✅ Import new controller
} = require('../controllers/user.controller');

// ✅ Add this route before `/:id`
router.get('/', auth, getAllUsers); // Get all users (used in Chat)

router.get('/:id', auth, getUserProfile);
router.put('/:id', auth, updateUserProfile);
router.post('/connect/:id', auth, sendConnectionRequest);
router.post('/accept/:id', auth, acceptConnectionRequest);

module.exports = router;
