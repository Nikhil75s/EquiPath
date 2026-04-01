const JobSeeker = require('../models/pg/JobSeeker');
const Application = require('../models/pg/Application');
const { query } = require('../config/db');
const aiService = require('../services/aiService');
const CareerPath = require('../models/mongo/CareerPath');

const jobSeekerController = {
  // GET /api/seeker/profile
  async getProfile(req, res, next) {
    try {
      const profile = await JobSeeker.findByUserId(req.user.id);
      if (!profile) {
        return res.status(404).json({ success: false, error: 'Profile not found.' });
      }
      res.json({ success: true, data: profile, message: 'Profile retrieved.' });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/seeker/profile
  async updateProfile(req, res, next) {
    try {
      const profile = await JobSeeker.updateProfile(req.user.id, req.body);
      if (!profile) {
        return res.status(404).json({ success: false, error: 'Profile not found.' });
      }
      res.json({ success: true, data: profile, message: 'Profile updated.' });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/seeker/assessment
  async submitAssessment(req, res, next) {
    try {
      const seeker = await JobSeeker.findByUserId(req.user.id);
      if (!seeker) {
        return res.status(404).json({ success: false, error: 'Seeker profile not found.' });
      }

      const { responses } = req.body;
      if (!responses) {
        return res.status(400).json({ success: false, error: 'Assessment responses required.' });
      }

      // Compute scores from responses
      const scores = computeAssessmentScores(responses);

      // Save assessment
      await query(
        `INSERT INTO assessments (seeker_id, responses, scores) 
         VALUES ($1, $2, $3) RETURNING *`,
        [seeker.id, JSON.stringify(responses), JSON.stringify(scores)]
      );

      // Update seeker profile with computed abilities and score + mark assessment as done
      const updatedProfile = await JobSeeker.updateProfile(req.user.id, {
        fullName: responses.full_name || seeker.full_name,
        functionalAbilities: responses.abilities || {
          typing_wpm: responses.typing_wpm || 40,
          stress_tolerance: responses.stress_tolerance || 'medium',
          communication: responses.communication || 'written',
          mobility: responses.mobility || 'seated',
          auditory_processing: responses.auditory_processing || 'normal'
        },
        skills: responses.skills || seeker.skills,
        experienceYears: responses.experience_years ?? seeker.experience_years,
        educationLevel: responses.education_level || seeker.education_level,
        preferredWorkMode: responses.work_preference || seeker.preferred_work_mode,
        disabilityType: responses.disability_type || seeker.disability_type,
        abilityScore: scores.ability_score,
        assessmentDone: true
      });

      res.status(201).json({
        success: true,
        data: { 
          ability_score: scores.ability_score,
          scores,
          profile: updatedProfile
        },
        message: 'Assessment submitted successfully.'
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/seeker/jobs — AI-matched job listings
  async getMatchedJobs(req, res, next) {
    try {
      const seeker = await JobSeeker.findByUserId(req.user.id);
      if (!seeker) {
        return res.status(404).json({ success: false, error: 'Profile not found.' });
      }

      // Fetch active jobs from DB
      const jobsResult = await query(
        `SELECT j.*, e.company_name, e.accessibility_score 
         FROM jobs j JOIN employers e ON j.employer_id = e.id 
         WHERE j.is_active = true ORDER BY j.created_at DESC LIMIT 50`
      );

      const dbJobs = jobsResult.rows;
      if (dbJobs.length === 0) {
        return res.json({ success: true, data: { matches: [] }, message: 'No active jobs found.' });
      }

      try {
        // Call AI service with seeker data AND jobs
        const aiResult = await aiService.getJobMatches({
          seeker: {
            skills: seeker.skills || [],
            functional_abilities: seeker.functional_abilities || {},
            experience_years: seeker.experience_years || 0,
            preferred_work_mode: seeker.preferred_work_mode || 'remote'
          },
          jobs: dbJobs.map(j => ({
            id: j.id,
            title: j.title,
            required_skills: j.required_skills || [],
            required_abilities: j.required_abilities || {},
            work_mode: j.work_mode,
            employer_name: j.is_anonymous_hiring ? 'Anonymous Employer' : j.company_name
          }))
        });

        // Merge AI match scores with full job data
        const matches = (aiResult.matches || []).map(match => {
          const dbJob = dbJobs.find(j => j.id === match.job_id);
          return {
            ...dbJob,
            match_score: match.match_score,
            match_percentage: match.match_percentage || Math.round(match.match_score * 100),
            match_factors: match.match_factors || [],
            company_name: dbJob?.is_anonymous_hiring ? 'Anonymous Employer' : dbJob?.company_name
          };
        });

        res.json({ success: true, data: { matches }, message: 'Matched jobs retrieved.' });
      } catch (aiErr) {
        // Fallback: basic matching
        console.warn('AI service unavailable, using fallback matching:', aiErr.message);
        const matches = dbJobs.map(job => ({
          ...job,
          match_score: calculateBasicMatchScore(seeker, job),
          match_percentage: Math.round(calculateBasicMatchScore(seeker, job) * 100),
          match_factors: getMatchFactors(seeker, job),
          company_name: job.is_anonymous_hiring ? 'Anonymous Employer' : job.company_name
        }));

        matches.sort((a, b) => b.match_score - a.match_score);
        res.json({ success: true, data: { matches: matches.slice(0, 20) }, message: 'Jobs retrieved (basic matching).' });
      }
    } catch (err) {
      next(err);
    }
  },

  // POST /api/seeker/jobs/:jobId/apply
  async applyToJob(req, res, next) {
    try {
      const seeker = await JobSeeker.findByUserId(req.user.id);
      if (!seeker) {
        return res.status(404).json({ success: false, error: 'Profile not found.' });
      }

      const jobId = parseInt(req.params.jobId);
      const jobResult = await query('SELECT * FROM jobs WHERE id = $1 AND is_active = true', [jobId]);
      if (jobResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Job not found or inactive.' });
      }

      // Check duplicate
      const isDuplicate = await Application.checkDuplicate(jobId, seeker.id);
      if (isDuplicate) {
        return res.status(409).json({ success: false, error: 'Already applied to this job.' });
      }

      const matchScore = calculateBasicMatchScore(seeker, jobResult.rows[0]);
      const application = await Application.create({
        jobId, seekerId: seeker.id, matchScore
      });

      res.status(201).json({
        success: true,
        data: { application_id: application.id, match_score: matchScore },
        message: 'Application submitted anonymously.'
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/seeker/applications
  async getApplications(req, res, next) {
    try {
      const seeker = await JobSeeker.findByUserId(req.user.id);
      if (!seeker) {
        return res.status(404).json({ success: false, error: 'Profile not found.' });
      }

      const applications = await Application.findBySeekerId(seeker.id);
      res.json({ success: true, data: applications, message: 'Applications retrieved.' });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/seeker/jobs/:jobId/gap
  async getSkillGap(req, res, next) {
    try {
      const seeker = await JobSeeker.findByUserId(req.user.id);
      if (!seeker) {
        return res.status(404).json({ success: false, error: 'Profile not found.' });
      }

      const jobId = parseInt(req.params.jobId);
      const job = await query('SELECT * FROM jobs WHERE id = $1', [jobId]);
      if (job.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Job not found.' });
      }

      try {
        const gap = await aiService.getSkillGap({
          seeker_skills: seeker.skills || [],
          job_required_skills: job.rows[0].required_skills || []
        });

        // Save to skill_gaps table
        await query(
          `INSERT INTO skill_gaps (seeker_id, job_id, missing_skills, recommended_courses, gap_score)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT DO NOTHING`,
          [seeker.id, jobId, gap.missing_skills || [], JSON.stringify(gap.recommended_courses || []), gap.gap_score || 0]
        );

        res.json({ success: true, data: gap, message: 'Skill gap analysis complete.' });
      } catch (aiErr) {
        // Fallback
        const seekerSkills = (seeker.skills || []).map(s => s.toLowerCase());
        const requiredSkills = (job.rows[0].required_skills || []);
        const missing = requiredSkills.filter(s => !seekerSkills.includes(s.toLowerCase()));
        const gapScore = requiredSkills.length > 0 ? missing.length / requiredSkills.length : 0;

        res.json({
          success: true,
          data: { 
            gap_score: parseFloat(gapScore.toFixed(2)), 
            gap_percentage: Math.round(gapScore * 100),
            missing_skills: missing, 
            recommended_courses: [] 
          },
          message: 'Skill gap analysis complete (basic).'
        });
      }
    } catch (err) {
      next(err);
    }
  },

  // GET /api/seeker/career-path
  async getCareerPath(req, res, next) {
    try {
      const seeker = await JobSeeker.findByUserId(req.user.id);
      if (!seeker) {
        return res.status(404).json({ success: false, error: 'Profile not found.' });
      }

      let careerPath = await CareerPath.findOne({ seekerId: seeker.id });
      if (!careerPath) {
        careerPath = await CareerPath.create({
          seekerId: seeker.id,
          currentRole: '',
          targetRole: '',
          milestones: [],
          completedCourses: [],
          wellnessCheckins: []
        });
      }

      res.json({ success: true, data: careerPath, message: 'Career path retrieved.' });
    } catch (err) {
      console.warn('MongoDB unavailable for career path:', err.message);
      res.json({
        success: true,
        data: { milestones: [], completedCourses: [], wellnessCheckins: [] },
        message: 'Career path retrieved (offline mode).'
      });
    }
  },

  // PUT /api/seeker/career-path
  async updateCareerPath(req, res, next) {
    try {
      const seeker = await JobSeeker.findByUserId(req.user.id);
      if (!seeker) {
        return res.status(404).json({ success: false, error: 'Profile not found.' });
      }

      const { currentRole, targetRole, milestones } = req.body;
      let careerPath = await CareerPath.findOne({ seekerId: seeker.id });
      if (!careerPath) {
        careerPath = new CareerPath({ seekerId: seeker.id });
      }

      if (currentRole !== undefined) careerPath.currentRole = currentRole;
      if (targetRole !== undefined) careerPath.targetRole = targetRole;
      if (milestones !== undefined) careerPath.milestones = milestones;
      await careerPath.save();

      res.json({ success: true, data: careerPath, message: 'Career path updated.' });
    } catch (err) {
      console.warn('MongoDB unavailable:', err.message);
      res.json({ success: true, data: req.body, message: 'Career path noted (offline).' });
    }
  },

  // POST /api/seeker/career-path/wellness
  async logWellness(req, res, next) {
    try {
      const seeker = await JobSeeker.findByUserId(req.user.id);
      if (!seeker) {
        return res.status(404).json({ success: false, error: 'Profile not found.' });
      }

      const { mood, note } = req.body;
      if (!mood || mood < 1 || mood > 5) {
        return res.status(400).json({ success: false, error: 'Mood must be 1-5.' });
      }

      let careerPath = await CareerPath.findOne({ seekerId: seeker.id });
      if (!careerPath) {
        careerPath = new CareerPath({ seekerId: seeker.id });
      }

      careerPath.wellnessCheckins.push({ mood, note });
      await careerPath.save();

      res.status(201).json({
        success: true,
        data: careerPath.wellnessCheckins[careerPath.wellnessCheckins.length - 1],
        message: 'Wellness check-in logged.'
      });
    } catch (err) {
      console.warn('MongoDB unavailable for wellness:', err.message);
      res.json({ success: true, data: { mood: req.body.mood }, message: 'Wellness noted (offline).' });
    }
  }
};

// Helper: compute assessment scores
function computeAssessmentScores(responses) {
  let score = 50; // base score

  const wpm = responses.typing_wpm || responses.typing_test || 40;
  score += Math.min(wpm / 2, 15);

  if (responses.stress_tolerance === 'high') score += 10;
  else if (responses.stress_tolerance === 'medium') score += 5;

  const exp = responses.experience_years || 0;
  score += Math.min(exp * 2, 10);

  if (responses.skills && responses.skills.length > 0) {
    score += Math.min(responses.skills.length * 2, 15);
  }

  score = Math.min(Math.max(Math.round(score), 0), 100);

  return {
    ability_score: score,
    typing_percentile: Math.min(Math.round((wpm / 80) * 100), 100),
    stress_resilience: responses.stress_tolerance === 'high' ? 90 : responses.stress_tolerance === 'medium' ? 70 : 50,
    communication_score: 75,
    overall_readiness: score
  };
}

// Helper: basic match score fallback
function calculateBasicMatchScore(seeker, job) {
  const seekerSkills = (seeker.skills || []).map(s => s.toLowerCase());
  const requiredSkills = (job.required_skills || []).map(s => s.toLowerCase());

  if (requiredSkills.length === 0) return 0.5;

  const matches = requiredSkills.filter(s => seekerSkills.includes(s));
  let score = matches.length / requiredSkills.length;

  // Work mode bonus
  if (seeker.preferred_work_mode === job.work_mode) score += 0.1;

  return Math.min(parseFloat(score.toFixed(2)), 1.0);
}

// Helper: get match factors
function getMatchFactors(seeker, job) {
  const factors = [];
  const seekerSkills = (seeker.skills || []).map(s => s.toLowerCase());
  const requiredSkills = (job.required_skills || []);

  requiredSkills.forEach(s => {
    if (seekerSkills.includes(s.toLowerCase())) factors.push(s);
  });

  if (seeker.preferred_work_mode === job.work_mode) {
    factors.push(`${job.work_mode} work`);
  }

  return factors;
}

module.exports = jobSeekerController;
