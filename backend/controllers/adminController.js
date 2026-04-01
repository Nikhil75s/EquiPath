const User = require('../models/pg/User');
const Job = require('../models/pg/Job');
const Application = require('../models/pg/Application');

const adminController = {
  // GET /api/admin/stats — also available as public endpoint
  async getStats(req, res, next) {
    try {
      const [totalUsers, seekerCount, employerCount, activeJobs, totalApps, appsThisMonth, avgScore, monthlyStats] = await Promise.all([
        User.count(),
        User.countByRole('jobseeker'),
        User.countByRole('employer'),
        Job.count(),
        Application.count(),
        Application.countThisMonth(),
        Application.avgMatchScore(),
        Application.monthlyStats()
      ]);

      res.json({
        success: true,
        data: {
          total_users: totalUsers,
          seekers: seekerCount,
          employers: employerCount,
          active_jobs: activeJobs,
          total_applications: totalApps,
          applications_this_month: appsThisMonth,
          avg_match_score: parseFloat((avgScore || 0).toFixed(2)),
          monthly_trend: monthlyStats
        },
        message: 'Platform stats retrieved.'
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/admin/users
  async getUsers(req, res, next) {
    try {
      const { role } = req.query;
      let users;
      if (role) {
        users = await User.findByRole(role);
      } else {
        users = await User.findAll();
      }

      res.json({ success: true, data: users, message: 'Users retrieved.' });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/admin/users/:id/deactivate
  async deactivateUser(req, res, next) {
    try {
      const userId = parseInt(req.params.id);
      
      // Prevent deactivating self
      if (userId === req.user.id) {
        return res.status(400).json({ success: false, error: 'Cannot deactivate your own account.' });
      }

      const deactivated = await User.deactivate(userId);
      if (!deactivated) {
        return res.status(404).json({ success: false, error: 'User not found.' });
      }

      res.json({ success: true, data: deactivated, message: 'User deactivated.' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = adminController;
