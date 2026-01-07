const Post = require('../models/Post');
const cloudinary = require('../config/cloudinary');
const { v4: uuidv4 } = require('uuid');
const Notification = require('../models/Notification');

// Helper for Cloudinary buffer uploads
const uploadBufferToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, public_id: uuidv4(), resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// ✅ Create Post
exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let imageUrl = '';
    if (req.file && req.file.buffer) {
      const result = await uploadBufferToCloudinary(req.file.buffer, 'posts');
      imageUrl = result.secure_url;
    }

    const post = await Post.create({
      userId: req.user._id,
      content,
      image: imageUrl
    });

    res.status(201).json(post);
  } catch (err) {
    console.error('POST CREATE ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update Post
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (req.body.content) post.content = req.body.content;

    if (req.file && req.file.buffer) {
      const result = await uploadBufferToCloudinary(req.file.buffer, 'posts');
      post.image = result.secure_url;
    }

    await post.save();
    res.json(post);
  } catch (err) {
    console.error('UPDATE POST ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Feed (with commenter names)
exports.getFeed = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'name profilePic')
      .populate('comments.userId', 'name profilePic')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Like Post + Notification
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (!post.likes.includes(req.user._id)) {
      post.likes.push(req.user._id);
      await post.save();

      const notif = await Notification.create({
        userId: post.userId,
        type: 'like',
        content: `${req.user.name} liked your post`
      });

      const io = req.app.get('io');
      io.to(post.userId.toString()).emit('new_notification', notif);
    }

    res.json(post);
  } catch (err) {
    console.error('LIKE POST ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Comment on Post
exports.commentOnPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.comments.push({
      userId: req.user._id,
      text: req.body.text,
      createdAt: new Date()
    });

    await post.save();

    await post.populate('userId', 'name profilePic');
    await post.populate('comments.userId', 'name profilePic');

    res.json(post);
  } catch (err) {
    console.error('COMMENT ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete Post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('DELETE POST ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get User Posts
exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId })
      .populate('userId', 'name profilePic')
      .populate('comments.userId', 'name profilePic')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
