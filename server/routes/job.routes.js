const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {
  createJob,
  getJobs,
  applyToJob,
  getApplicants,
  respondApplicant
} = require('../controllers/job.controller');

router.post('/', auth, createJob);
router.get('/', auth, getJobs);
router.post('/apply/:jobId', auth, applyToJob);

// New routes
router.get('/:jobId/applicants', auth, getApplicants);
router.post('/:jobId/respond', auth, respondApplicant);

module.exports = router;
