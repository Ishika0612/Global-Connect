const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {
  getAllUsers,
  deleteUser,
  deletePost,
  deleteJob
} = require('../controllers/admin.controller');

// Admin-only actions (add role-check in future)
router.get('/users', auth, getAllUsers);
router.delete('/user/:id', auth, deleteUser);
router.delete('/post/:id', auth, deletePost);
router.delete('/job/:id', auth, deleteJob);

module.exports = router;
