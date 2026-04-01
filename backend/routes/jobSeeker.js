const express = require('express');
const router = express.Router();
const jobSeekerController = require('../controllers/jobSeekerController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// All routes require auth + jobseeker role
router.use(authMiddleware);
router.use(roleMiddleware('jobseeker'));

// GET /api/seeker/profile
router.get('/profile', jobSeekerController.getProfile);

// PUT /api/seeker/profile
router.put('/profile', jobSeekerController.updateProfile);

// POST /api/seeker/assessment
router.post('/assessment', jobSeekerController.submitAssessment);

// GET /api/seeker/jobs — AI-matched job listings
router.get('/jobs', jobSeekerController.getMatchedJobs);

// POST /api/seeker/jobs/:jobId/apply
router.post('/jobs/:jobId/apply', jobSeekerController.applyToJob);

// GET /api/seeker/applications
router.get('/applications', jobSeekerController.getApplications);

// GET /api/seeker/jobs/:jobId/gap
router.get('/jobs/:jobId/gap', jobSeekerController.getSkillGap);

// GET /api/seeker/career-path
router.get('/career-path', jobSeekerController.getCareerPath);

// PUT /api/seeker/career-path
router.put('/career-path', jobSeekerController.updateCareerPath);

// POST /api/seeker/career-path/wellness
router.post('/career-path/wellness', jobSeekerController.logWellness);

module.exports = router;
