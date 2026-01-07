const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  description: String,
  skills: [String],
  location: String,
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // applicants here
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);
