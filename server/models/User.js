const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  profilePic: { type: String, default: '' },
  bio: String,
  skills: [String],
  experience: [{
    company: String,
    role: String,
    from: Date,
    to: Date,
  }],
  education: [{
    school: String,
    degree: String,
    from: Date,
    to: Date,
  }],
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  connectionRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
