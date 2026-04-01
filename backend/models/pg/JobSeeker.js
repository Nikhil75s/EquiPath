const { query } = require('../../config/db');

const JobSeeker = {
  async create({ userId, fullName, disabilityType }) {
    const result = await query(
      `INSERT INTO job_seekers (user_id, full_name, disability_type) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [userId, fullName, disabilityType]
    );
    return result.rows[0];
  },

  async findByUserId(userId) {
    const result = await query(
      'SELECT * FROM job_seekers WHERE user_id = $1',
      [userId]
    );
    return result.rows[0];
  },

  async findById(id) {
    const result = await query(
      'SELECT * FROM job_seekers WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  async updateProfile(userId, data) {
    const {
      fullName, disabilityType, functionalAbilities, skills,
      experienceYears, educationLevel, preferredWorkMode, abilityScore,
      assessmentDone
    } = data;

    const result = await query(
      `UPDATE job_seekers SET
        full_name = COALESCE($2, full_name),
        disability_type = COALESCE($3, disability_type),
        functional_abilities = COALESCE($4, functional_abilities),
        skills = COALESCE($5, skills),
        experience_years = COALESCE($6, experience_years),
        education_level = COALESCE($7, education_level),
        preferred_work_mode = COALESCE($8, preferred_work_mode),
        ability_score = COALESCE($9, ability_score),
        assessment_done = COALESCE($10, assessment_done)
       WHERE user_id = $1
       RETURNING *`,
      [userId, fullName, disabilityType,
       functionalAbilities ? JSON.stringify(functionalAbilities) : null,
       skills || null, experienceYears, educationLevel, preferredWorkMode,
       abilityScore, assessmentDone]
    );
    return result.rows[0];
  },

  async getAnonymousProfile(seekerId) {
    const result = await query(
      `SELECT id, skills, experience_years, education_level, 
              preferred_work_mode, ability_score, functional_abilities
       FROM job_seekers WHERE id = $1`,
      [seekerId]
    );
    return result.rows[0];
  },

  async getFullProfile(seekerId) {
    const result = await query(
      `SELECT js.*, u.email FROM job_seekers js
       JOIN users u ON js.user_id = u.id
       WHERE js.id = $1`,
      [seekerId]
    );
    return result.rows[0];
  },

  async count() {
    const result = await query('SELECT COUNT(*) FROM job_seekers');
    return parseInt(result.rows[0].count);
  }
};

module.exports = JobSeeker;
