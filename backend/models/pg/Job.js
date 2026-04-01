const { query } = require('../../config/db');

const Job = {
  async create(data) {
    const {
      employerId, title, description, requiredSkills,
      requiredAbilities, workMode, salaryRange, isAnonymousHiring
    } = data;

    const result = await query(
      `INSERT INTO jobs (employer_id, title, description, required_skills, 
       required_abilities, work_mode, salary_range, is_anonymous_hiring) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [employerId, title, description, requiredSkills,
       JSON.stringify(requiredAbilities), workMode, salaryRange,
       isAnonymousHiring !== undefined ? isAnonymousHiring : true]
    );
    return result.rows[0];
  },

  async findById(id) {
    const result = await query(
      `SELECT j.*, e.company_name, e.accessibility_score 
       FROM jobs j 
       JOIN employers e ON j.employer_id = e.id 
       WHERE j.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async findAll({ workMode, isActive = true, limit = 50, offset = 0 } = {}) {
    let sql = `SELECT j.*, e.company_name, e.accessibility_score 
               FROM jobs j 
               JOIN employers e ON j.employer_id = e.id 
               WHERE j.is_active = $1`;
    const params = [isActive];
    let paramIdx = 2;

    if (workMode) {
      sql += ` AND j.work_mode = $${paramIdx}`;
      params.push(workMode);
      paramIdx++;
    }

    sql += ` ORDER BY j.created_at DESC LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`;
    params.push(limit, offset);

    const result = await query(sql, params);
    return result.rows;
  },

  async findByEmployerId(employerId) {
    const result = await query(
      `SELECT j.*, 
        (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) as applicant_count
       FROM jobs j 
       WHERE j.employer_id = $1 
       ORDER BY j.created_at DESC`,
      [employerId]
    );
    return result.rows;
  },

  async update(id, data) {
    const { title, description, requiredSkills, requiredAbilities, workMode, salaryRange, isActive } = data;
    const result = await query(
      `UPDATE jobs SET
        title = COALESCE($2, title),
        description = COALESCE($3, description),
        required_skills = COALESCE($4, required_skills),
        required_abilities = COALESCE($5, required_abilities),
        work_mode = COALESCE($6, work_mode),
        salary_range = COALESCE($7, salary_range),
        is_active = COALESCE($8, is_active)
       WHERE id = $1
       RETURNING *`,
      [id, title, description, requiredSkills,
       requiredAbilities ? JSON.stringify(requiredAbilities) : null,
       workMode, salaryRange, isActive]
    );
    return result.rows[0];
  },

  async count() {
    const result = await query('SELECT COUNT(*) FROM jobs WHERE is_active = true');
    return parseInt(result.rows[0].count);
  }
};

module.exports = Job;
