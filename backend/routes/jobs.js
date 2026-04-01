const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

// GET /api/jobs — Public job listings (no auth required)
router.get('/', jobController.getAllJobs);

// GET /api/jobs/:id — Single job details
router.get('/:id', jobController.getJobById);

module.exports = router;
