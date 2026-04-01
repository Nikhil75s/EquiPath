const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

const aiService = {
  async getJobMatches(data) {
    // data = { seeker: {...}, jobs: [...] }
    const response = await axios.post(`${AI_SERVICE_URL}/match`, data, {
      timeout: 15000
    });
    return response.data;
  },

  async getSkillGap(data) {
    // data = { seeker_skills: [...], job_required_skills: [...] }
    const response = await axios.post(`${AI_SERVICE_URL}/skill-gap`, data, {
      timeout: 10000
    });
    return response.data;
  },

  async getEmployerScore(data) {
    // data = { has_accessibility_policy, remote_work_available, accommodation_budget (string), ... }
    const response = await axios.post(`${AI_SERVICE_URL}/employer-score`, data, {
      timeout: 10000
    });
    return response.data;
  }
};

module.exports = aiService;
