const { query } = require('../../config/db');

const Application = {
  async create({ jobId, seekerId, matchScore }) {
    const result = await query(
      `INSERT INTO applications (job_id, seeker_id, match_score) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [jobId, seekerId, matchScore || 0]
    );
    return result.rows[0];
  },

  async findById(id) {
    const result = await query(
      `SELECT a.*, j.title as job_title, j.work_mode, j.salary_range,
              e.company_name
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       JOIN employers e ON j.employer_id = e.id
       WHERE a.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async findBySeekerId(seekerId) {
    const result = await query(
      `SELECT a.*, j.title as job_title, j.work_mode, j.salary_range,
              e.company_name
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       JOIN employers e ON j.employer_id = e.id
       WHERE a.seeker_id = $1
       ORDER BY a.applied_at DESC`,
      [seekerId]
    );
    return result.rows;
  },

  async findByJobId(jobId) {
    // Returns anonymous candidate info
    const result = await query(
      `SELECT a.id, a.match_score, a.status, a.disability_revealed, a.applied_at,
              js.id as seeker_id, js.skills, js.experience_years, 
              js.education_level, js.preferred_work_mode, 
              js.ability_score, js.functional_abilities,
              CASE WHEN a.disability_revealed = true THEN js.full_name 
                   ELSE 'Candidate #' || js.id END as display_name,
              CASE WHEN a.disability_revealed = true THEN js.resume_url 
                   ELSE NULL END as resume_url
       FROM applications a
       JOIN job_seekers js ON a.seeker_id = js.id
       WHERE a.job_id = $1
       ORDER BY a.match_score DESC`,
      [jobId]
    );
    return result.rows;
  },

  async updateStatus(id, status) {
    let disabilityRevealed = false;
    // Reveal disability only when shortlisted or beyond
    if (['shortlisted', 'interview', 'offer'].includes(status)) {
      disabilityRevealed = true;
    }

    const result = await query(
      `UPDATE applications SET 
        status = $2, 
        disability_revealed = $3,
        updated_at = NOW()
       WHERE id = $1 
       RETURNING *`,
      [id, status, disabilityRevealed]
    );
    return result.rows[0];
  },

  async checkDuplicate(jobId, seekerId) {
    const result = await query(
      'SELECT id FROM applications WHERE job_id = $1 AND seeker_id = $2',
      [jobId, seekerId]
    );
    return result.rows.length > 0;
  },

  async count() {
    const result = await query('SELECT COUNT(*) FROM applications');
    return parseInt(result.rows[0].count);
  },

  async countThisMonth() {
    const result = await query(
      `SELECT COUNT(*) FROM applications 
       WHERE applied_at >= date_trunc('month', CURRENT_DATE)`
    );
    return parseInt(result.rows[0].count);
  },

  async avgMatchScore() {
    const result = await query(
      'SELECT AVG(match_score) as avg_score FROM applications WHERE match_score IS NOT NULL'
    );
    return parseFloat(result.rows[0].avg_score) || 0;
  },

  async monthlyStats() {
    const result = await query(
      `SELECT 
        TO_CHAR(applied_at, 'YYYY-MM') as month,
        COUNT(*) as count
       FROM applications
       WHERE applied_at >= NOW() - INTERVAL '12 months'
       GROUP BY TO_CHAR(applied_at, 'YYYY-MM')
       ORDER BY month`
    );
    return result.rows;
  }
};

module.exports = Application;
