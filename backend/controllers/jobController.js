const Job = require('../models/pg/Job');

const jobController = {
  // GET /api/jobs — Public job listings
  async getAllJobs(req, res, next) {
    try {
      const { workMode, limit, offset } = req.query;
      const jobs = await Job.findAll({
        workMode,
        limit: parseInt(limit) || 50,
        offset: parseInt(offset) || 0
      });

      // Hide company names for anonymous hiring
      const sanitized = jobs.map(job => ({
        ...job,
        company_name: job.is_anonymous_hiring ? 'Anonymous Employer' : job.company_name
      }));

      res.json({ success: true, data: sanitized, message: 'Jobs retrieved.' });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/jobs/:id
  async getJobById(req, res, next) {
    try {
      const job = await Job.findById(parseInt(req.params.id));
      if (!job) {
        return res.status(404).json({ success: false, error: 'Job not found.' });
      }

      if (job.is_anonymous_hiring) {
        job.company_name = 'Anonymous Employer';
      }

      res.json({ success: true, data: job, message: 'Job retrieved.' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = jobController;
