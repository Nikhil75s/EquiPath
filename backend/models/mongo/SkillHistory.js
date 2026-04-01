const mongoose = require('mongoose');

const skillHistorySchema = new mongoose.Schema({
  seekerId: { type: Number, required: true, index: true },
  entries: [{
    skill: { type: String, required: true },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'] },
    acquiredAt: { type: Date, default: Date.now },
    source: { type: String, enum: ['self_reported', 'assessment', 'course_completion', 'certification'] },
    verified: { type: Boolean, default: false }
  }],
  lastUpdated: { type: Date, default: Date.now }
});

skillHistorySchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('SkillHistory', skillHistorySchema);
