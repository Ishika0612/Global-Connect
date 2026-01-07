const Job = require('../models/Job');
const Notification = require('../models/Notification');

exports.createJob = async (req, res) => {
  try {
    const job = await Job.create({
      postedBy: req.user._id,
      title: req.body.title,
      description: req.body.description,
      skills: req.body.skills,
      location: req.body.location
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'name');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    if (job.applicants.includes(req.user._id)) {
      return res.status(400).json({ error: 'Already applied' });
    }

    job.applicants.push(req.user._id);
    await job.save();

    res.json({ message: 'Applied successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// New: Get applicants for a job
exports.getApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId).populate('applicants', 'name email phone');
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job.applicants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// New: Accept or Reject applicant and send notification
exports.respondApplicant = async (req, res) => {
  const { jobId } = req.params;
  const { applicantId, action } = req.body; // 'accept' or 'reject'

  try {
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    // Check if current user is job creator
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Check if applicant actually applied
    if (!job.applicants.includes(applicantId)) {
      return res.status(400).json({ error: 'Applicant did not apply' });
    }

    // Send notification
    const content = action === 'accept' 
      ? `🎉 Congratulations! You have been accepted for the job "${job.title}".`
      : `🙏 We regret to inform you that you were not selected for the job "${job.title}".`;

    await Notification.create({
      userId: applicantId,
      type: 'job_response',
      content,
    });

    res.json({ message: `Applicant ${action}ed successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
