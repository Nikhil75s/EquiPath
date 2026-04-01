const Employer = require('../models/pg/Employer');
const Job = require('../models/pg/Job');
const Application = require('../models/pg/Application');
const aiService = require('../services/aiService');
const { query } = require('../config/db');

const employerController = {
  // GET /api/employer/profile
  async getProfile(req, res, next) {
    try {
      const profile = await Employer.findByUserId(req.user.id);
      if (!profile) {
        return res.status(404).json({ success: false, error: 'Employer profile not found.' });
      }
      res.json({ success: true, data: profile, message: 'Profile retrieved.' });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/employer/profile
  async updateProfile(req, res, next) {
    try {
      const profile = await Employer.updateProfile(req.user.id, req.body);
      if (!profile) {
        return res.status(404).json({ success: false, error: 'Profile not found.' });
      }
      res.json({ success: true, data: profile, message: 'Profile updated.' });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/employer/jobs
  async postJob(req, res, next) {
    try {
      const employer = await Employer.findByUserId(req.user.id);
      if (!employer) {
        return res.status(404).json({ success: false, error: 'Employer profile not found.' });
      }

      const { title, description, requiredSkills, requiredAbilities, workMode, salaryRange, isAnonymousHiring } = req.body;
      
      if (!title || !description) {
        return res.status(400).json({ success: false, error: 'Title and description are required.' });
      }

      const job = await Job.create({
        employerId: employer.id,
        title, description, requiredSkills, requiredAbilities,
        workMode, salaryRange, isAnonymousHiring
      });

      res.status(201).json({ success: true, data: job, message: 'Job posted successfully.' });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/employer/jobs
  async getJobs(req, res, next) {
    try {
      const employer = await Employer.findByUserId(req.user.id);
      if (!employer) {
        return res.status(404).json({ success: false, error: 'Employer profile not found.' });
      }

      const jobs = await Job.findByEmployerId(employer.id);
      res.json({ success: true, data: jobs, message: 'Jobs retrieved.' });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/employer/jobs/:id
  async updateJob(req, res, next) {
    try {
      const employer = await Employer.findByUserId(req.user.id);
      if (!employer) {
        return res.status(404).json({ success: false, error: 'Employer profile not found.' });
      }

      const jobId = parseInt(req.params.id);
      const job = await Job.findById(jobId);
      if (!job || job.employer_id !== employer.id) {
        return res.status(403).json({ success: false, error: 'Not authorized to edit this job.' });
      }

      const updated = await Job.update(jobId, req.body);
      res.json({ success: true, data: updated, message: 'Job updated.' });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/employer/jobs/:id/deactivate
  async deactivateJob(req, res, next) {
    try {
      const employer = await Employer.findByUserId(req.user.id);
      if (!employer) {
        return res.status(404).json({ success: false, error: 'Employer profile not found.' });
      }

      const jobId = parseInt(req.params.id);
      const job = await Job.findById(jobId);
      if (!job || job.employer_id !== employer.id) {
        return res.status(403).json({ success: false, error: 'Not authorized.' });
      }

      const updated = await Job.update(jobId, { isActive: false });
      res.json({ success: true, data: updated, message: 'Job deactivated.' });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/employer/jobs/:id/applicants
  async getApplicants(req, res, next) {
    try {
      const employer = await Employer.findByUserId(req.user.id);
      if (!employer) {
        return res.status(404).json({ success: false, error: 'Employer profile not found.' });
      }

      const jobId = parseInt(req.params.id);
      const job = await Job.findById(jobId);
      if (!job || job.employer_id !== employer.id) {
        return res.status(403).json({ success: false, error: 'Not authorized to view these applicants.' });
      }

      const applicants = await Application.findByJobId(jobId);
      
      // Apply anonymous hiring logic
      const sanitized = applicants.map(app => {
        const result = { ...app };
        if (job.is_anonymous_hiring && !app.disability_revealed) {
          result.display_name = `Candidate #${app.seeker_id}`;
          result.disability_type = null;
        }
        return result;
      });

      res.json({ success: true, data: { applicants: sanitized, job }, message: 'Applicants retrieved.' });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/employer/jobs/:jobId/applicants/:appId/status
  async updateApplicationStatus(req, res, next) {
    try {
      const { status } = req.body;
      if (!['applied', 'shortlisted', 'interview', 'offer', 'rejected'].includes(status)) {
        return res.status(400).json({ success: false, error: 'Invalid status.' });
      }

      const appId = parseInt(req.params.appId);
      const application = await Application.updateStatus(appId, status);
      if (!application) {
        return res.status(404).json({ success: false, error: 'Application not found.' });
      }

      res.json({ success: true, data: application, message: `Application ${status}.` });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/employer/audit
  async submitReadinessAudit(req, res, next) {
    try {
      const employer = await Employer.findByUserId(req.user.id);
      if (!employer) {
        return res.status(404).json({ success: false, error: 'Employer profile not found.' });
      }

      const auditData = {
        has_accessibility_policy: !!req.body.has_accessibility_policy,
        remote_work_available: !!req.body.remote_work_available,
        accommodation_budget: req.body.accommodation_budget || 'none',
        disability_training: !!req.body.disability_training,
        accessible_workspace: !!req.body.accessible_workspace,
        flexible_hours: !!req.body.flexible_hours
      };

      try {
        const result = await aiService.getEmployerScore(auditData);
        
        // Update employer profile with all audit fields
        await Employer.updateProfile(req.user.id, {
          hasAccessibilityPolicy: auditData.has_accessibility_policy,
          remoteWorkAvailable: auditData.remote_work_available,
          accommodationBudget: auditData.accommodation_budget,
          disabilityTraining: auditData.disability_training,
          accessibleWorkspace: auditData.accessible_workspace,
          flexibleHours: auditData.flexible_hours,
          accessibilityScore: result.readiness_score,
          auditDone: true
        });

        res.json({ success: true, data: result, message: 'Readiness audit complete.' });
      } catch (aiErr) {
        // Fallback local scoring
        const score = calculateLocalReadinessScore(auditData);
        
        await Employer.updateProfile(req.user.id, {
          hasAccessibilityPolicy: auditData.has_accessibility_policy,
          remoteWorkAvailable: auditData.remote_work_available,
          accommodationBudget: auditData.accommodation_budget,
          disabilityTraining: auditData.disability_training,
          accessibleWorkspace: auditData.accessible_workspace,
          flexibleHours: auditData.flexible_hours,
          accessibilityScore: score.readiness_score,
          auditDone: true
        });

        res.json({ success: true, data: score, message: 'Readiness audit complete (local scoring).' });
      }
    } catch (err) {
      next(err);
    }
  },

  // GET /api/employer/audit-result
  async getAuditResult(req, res, next) {
    try {
      const employer = await Employer.findByUserId(req.user.id);
      if (!employer) {
        return res.status(404).json({ success: false, error: 'Employer profile not found.' });
      }

      if (!employer.audit_done) {
        return res.json({ success: true, data: { audit_done: false }, message: 'No audit completed yet.' });
      }

      const score = employer.accessibility_score || 0;
      const grade = score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D';

      const strengths = [];
      const improvements = [];
      if (employer.has_accessibility_policy) strengths.push('has_accessibility_policy'); else improvements.push('has_accessibility_policy');
      if (employer.remote_work_available) strengths.push('remote_work_available'); else improvements.push('remote_work_available');
      if (employer.disability_training) strengths.push('disability_training'); else improvements.push('disability_training');
      if (employer.accessible_workspace) strengths.push('accessible_workspace'); else improvements.push('accessible_workspace');
      if (employer.flexible_hours) strengths.push('flexible_hours'); else improvements.push('flexible_hours');

      res.json({
        success: true,
        data: { 
          readiness_score: score, 
          grade, 
          audit_done: true,
          strengths, 
          improvement_areas: improvements 
        },
        message: 'Audit result retrieved.'
      });
    } catch (err) {
      next(err);
    }
  }
};

function calculateLocalReadinessScore(data) {
  const WEIGHTS = {
    has_accessibility_policy: 20,
    remote_work_available: 15,
    disability_training: 20,
    accessible_workspace: 10,
    flexible_hours: 10
  };
  const BUDGET_SCORES = { none: 0, under_5k: 5, '5k-20k': 15, over_20k: 25 };

  let score = 0;
  const strengths = [];
  const improvements = [];

  for (const [key, weight] of Object.entries(WEIGHTS)) {
    if (data[key]) { score += weight; strengths.push(key); }
    else improvements.push(key);
  }

  const budgetKey = data.accommodation_budget || 'none';
  score += BUDGET_SCORES[budgetKey] || 0;
  if (BUDGET_SCORES[budgetKey] >= 15) strengths.push('accommodation_budget');
  else improvements.push('accommodation_budget');

  const grade = score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D';

  const RECOMMENDATIONS = {
    has_accessibility_policy: 'Develop and publish a formal accessibility and inclusion policy.',
    remote_work_available: 'Consider offering remote work options to widen your talent pool.',
    accommodation_budget: 'Contact the Job Accommodation Network (askjan.org) for cost-effective accommodation options.',
    disability_training: 'Enroll your HR team in a disability awareness training program (e.g. NASSCOM Foundation).',
    accessible_workspace: 'Commission a professional physical accessibility audit of your workspace.',
    flexible_hours: 'Consider introducing flexible working hours for employees who need schedule accommodation.'
  };

  const recommendations = improvements.map(area => RECOMMENDATIONS[area]).filter(Boolean);

  return { readiness_score: score, grade, strengths, improvement_areas: improvements, recommendations };
}

module.exports = employerController;
