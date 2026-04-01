const { query } = require('../../config/db');

const Employer = {
  async create({ userId, companyName, industry, companySize }) {
    const result = await query(
      `INSERT INTO employers (user_id, company_name, industry, company_size) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [userId, companyName, industry, companySize]
    );
    return result.rows[0];
  },

  async findByUserId(userId) {
    const result = await query(
      'SELECT * FROM employers WHERE user_id = $1',
      [userId]
    );
    return result.rows[0];
  },

  async findById(id) {
    const result = await query(
      'SELECT * FROM employers WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  async updateProfile(userId, data) {
    const {
      companyName, industry, companySize, accessibilityScore,
      hasAccessibilityPolicy, remoteWorkAvailable, accommodationBudget,
      disabilityTraining, accessibleWorkspace, flexibleHours, auditDone
    } = data;

    const result = await query(
      `UPDATE employers SET
        company_name = COALESCE($2, company_name),
        industry = COALESCE($3, industry),
        company_size = COALESCE($4, company_size),
        accessibility_score = COALESCE($5, accessibility_score),
        has_accessibility_policy = COALESCE($6, has_accessibility_policy),
        remote_work_available = COALESCE($7, remote_work_available),
        accommodation_budget = COALESCE($8, accommodation_budget),
        disability_training = COALESCE($9, disability_training),
        accessible_workspace = COALESCE($10, accessible_workspace),
        flexible_hours = COALESCE($11, flexible_hours),
        audit_done = COALESCE($12, audit_done)
       WHERE user_id = $1
       RETURNING *`,
      [userId, companyName, industry, companySize, accessibilityScore,
       hasAccessibilityPolicy, remoteWorkAvailable, accommodationBudget,
       disabilityTraining, accessibleWorkspace, flexibleHours, auditDone]
    );
    return result.rows[0];
  },

  async updateReadinessScore(employerId, score) {
    const result = await query(
      'UPDATE employers SET accessibility_score = $2 WHERE id = $1 RETURNING *',
      [employerId, score]
    );
    return result.rows[0];
  },

  async count() {
    const result = await query('SELECT COUNT(*) FROM employers');
    return parseInt(result.rows[0].count);
  }
};

module.exports = Employer;
