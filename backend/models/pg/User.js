const { query } = require('../../config/db');
const bcrypt = require('bcrypt');

const User = {
  async create({ email, password, role }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
      `INSERT INTO users (email, password, role) 
       VALUES ($1, $2, $3) 
       RETURNING id, email, role, created_at`,
      [email, hashedPassword, role]
    );
    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    );
    return result.rows[0];
  },

  async findById(id) {
    const result = await query(
      'SELECT id, email, role, is_active, created_at FROM users WHERE id = $1 AND is_active = true',
      [id]
    );
    return result.rows[0];
  },

  async findAll() {
    const result = await query(
      'SELECT id, email, role, is_active, created_at FROM users ORDER BY created_at DESC'
    );
    return result.rows;
  },

  async findByRole(role) {
    const result = await query(
      'SELECT id, email, role, is_active, created_at FROM users WHERE role = $1 ORDER BY created_at DESC',
      [role]
    );
    return result.rows;
  },

  async deactivate(id) {
    const result = await query(
      'UPDATE users SET is_active = false WHERE id = $1 RETURNING id, email, role',
      [id]
    );
    return result.rows[0];
  },

  async deleteById(id) {
    // Soft delete
    return this.deactivate(id);
  },

  async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  },

  async count() {
    const result = await query('SELECT COUNT(*) FROM users WHERE is_active = true');
    return parseInt(result.rows[0].count);
  },

  async countByRole(role) {
    const result = await query('SELECT COUNT(*) FROM users WHERE role = $1 AND is_active = true', [role]);
    return parseInt(result.rows[0].count);
  }
};

module.exports = User;
