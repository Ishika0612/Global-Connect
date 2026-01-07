const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const {
  createPost,
  getFeed,
  likePost,
  commentOnPost,
  deletePost,
  updatePost,
  getUserPosts
} = require('../controllers/post.controller');

// Create post (with image upload)
router.post('/', auth, upload.single('image'), createPost);

// Get feed + user posts
router.get('/', auth, getFeed);
router.get('/feed', auth, getFeed);
router.get('/user/:userId', auth, getUserPosts);

// Like / Comment
router.post('/like/:postId', auth, likePost);
router.post('/comment/:postId', auth, commentOnPost);

// Delete / Update
router.delete('/:postId', auth, deletePost);
router.put('/:postId', auth, upload.single('image'), updatePost);

module.exports = router;
