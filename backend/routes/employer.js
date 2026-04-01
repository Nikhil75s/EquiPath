const express = require('express');
const router = express.Router();
const employerController = require('../controllers/employerController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// All routes require auth + employer role
router.use(authMiddleware);
router.use(roleMiddleware('employer'));

// GET /api/employer/profile
router.get('/profile', employerController.getProfile);

// PUT /api/employer/profile
router.put('/profile', employerController.updateProfile);

// POST /api/employer/jobs
router.post('/jobs', employerController.postJob);

// GET /api/employer/jobs
router.get('/jobs', employerController.getJobs);

// PUT /api/employer/jobs/:id
router.put('/jobs/:id', employerController.updateJob);

// PUT /api/employer/jobs/:id/deactivate
router.put('/jobs/:id/deactivate', employerController.deactivateJob);

// GET /api/employer/jobs/:id/applicants
router.get('/jobs/:id/applicants', employerController.getApplicants);

// PUT /api/employer/jobs/:jobId/applicants/:appId/status
router.put('/jobs/:jobId/applicants/:appId/status', employerController.updateApplicationStatus);

// POST /api/employer/audit
router.post('/audit', employerController.submitReadinessAudit);

// GET /api/employer/audit-result
router.get('/audit-result', employerController.getAuditResult);

module.exports = router;
