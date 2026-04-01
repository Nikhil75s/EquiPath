const jwt = require('jsonwebtoken');
const User = require('../models/pg/User');
const JobSeeker = require('../models/pg/JobSeeker');
const Employer = require('../models/pg/Employer');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const authController = {
  // POST /api/auth/register
  async register(req, res, next) {
    try {
      const { email, password, role, fullName, companyName, industry, companySize } = req.body;

      if (!email || !password || !role) {
        return res.status(400).json({
          success: false,
          error: 'Email, password, and role are required.'
        });
      }

      if (!['jobseeker', 'employer'].includes(role)) {
        return res.status(400).json({
          success: false,
          error: 'Role must be jobseeker or employer.'
        });
      }

      // Check if user exists
      const existing = await User.findByEmail(email);
      if (existing) {
        return res.status(409).json({
          success: false,
          error: 'An account with this email already exists.'
        });
      }

      // Create user
      const user = await User.create({ email, password, role });

      // Create role-specific profile
      if (role === 'jobseeker') {
        await JobSeeker.create({
          userId: user.id,
          fullName: fullName || '',
          disabilityType: null
        });
      } else if (role === 'employer') {
        await Employer.create({
          userId: user.id,
          companyName: companyName || '',
          industry: industry || '',
          companySize: companySize || ''
        });
      }

      const token = generateToken(user);

      res.status(201).json({
        success: true,
        data: {
          user: { id: user.id, email: user.email, role: user.role },
          token
        },
        message: 'Registration successful.'
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/auth/login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required.'
        });
      }

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password.'
        });
      }

      const isMatch = await User.comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password.'
        });
      }

      const token = generateToken(user);

      res.json({
        success: true,
        data: {
          user: { id: user.id, email: user.email, role: user.role },
          token
        },
        message: 'Login successful.'
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/auth/me
  async getMe(req, res, next) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found.'
        });
      }

      let profile = null;
      if (user.role === 'jobseeker') {
        profile = await JobSeeker.findByUserId(user.id);
      } else if (user.role === 'employer') {
        profile = await Employer.findByUserId(user.id);
      }

      res.json({
        success: true,
        data: { user, profile },
        message: 'Profile retrieved.'
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = authController;
