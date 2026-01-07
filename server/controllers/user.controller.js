const User = require('../models/User');

// ✅ Get current user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update profile
exports.updateUserProfile = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Send connection request
exports.sendConnectionRequest = async (req, res) => {
  const targetId = req.params.id;
  try {
    const user = await User.findById(req.user._id);
    const target = await User.findById(targetId);
    if (!target) return res.status(404).json({ message: 'User not found' });

    if (!target.connectionRequests.includes(user._id)) {
      target.connectionRequests.push(user._id);
      await target.save();
    }
    res.json({ message: 'Connection request sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Accept connection request
exports.acceptConnectionRequest = async (req, res) => {
  const requesterId = req.params.id;
  try {
    const user = await User.findById(req.user._id);
    const requester = await User.findById(requesterId);
    if (!requester) return res.status(404).json({ message: 'User not found' });

    user.connections.push(requesterId);
    requester.connections.push(user._id);

    user.connectionRequests = user.connectionRequests.filter(id => id.toString() !== requesterId);

    await user.save();
    await requester.save();

    res.json({ message: 'Connection accepted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ NEW: Get all users (for chat)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '_id name email'); // only needed fields
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};
