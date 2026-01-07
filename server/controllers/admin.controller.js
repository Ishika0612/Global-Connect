const User = require('../models/User');
const Post = require('../models/Post');
const Job = require('../models/Job');

const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
};

const deletePost = async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: 'Post deleted' });
};

const deleteJob = async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ message: 'Job deleted' });
};

module.exports = {
  getAllUsers,
  deleteUser,
  deletePost,
  deleteJob
};
