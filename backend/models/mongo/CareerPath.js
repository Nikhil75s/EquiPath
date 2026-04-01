const mongoose = require('mongoose');

const careerPathSchema = new mongoose.Schema({
  seekerId: { type: Number, required: true, unique: true },
  currentRole: { type: String, default: '' },
  targetRole: { type: String, default: '' },
  milestones: [{
    title: String,
    description: String,
    isCompleted: { type: Boolean, default: false },
    completedAt: Date
  }],
  completedCourses: [{
    name: String,
    platform: String,
    completedAt: { type: Date, default: Date.now }
  }],
  wellnessCheckins: [{
    mood: { type: Number, min: 1, max: 5 },
    note: String,
    date: { type: Date, default: Date.now }
  }],
  updatedAt: { type: Date, default: Date.now }
});

careerPathSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('CareerPath', careerPathSchema);
