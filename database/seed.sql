-- EquiPath Seed Data
-- Generated with real bcrypt hashes
-- Passwords: admin@equipath.com = admin123, all others = test123

-- =====================
-- USERS
-- =====================
INSERT INTO users (email, password, role) VALUES
('admin@equipath.com', '$2b$10$Ickr9ikI8Bz.W50O46MjHO6v4y2hv1NT87FYdXi2iAzPTDxuO1OUG', 'admin'),
('hr@techcorp.com', '$2b$10$9M2/nB0uOwwaDkWAmDP8QODRL4ShScvSBocwwrzyV1FStwa7m.bQC', 'employer'),
('recruit@healthplus.com', '$2b$10$9M2/nB0uOwwaDkWAmDP8QODRL4ShScvSBocwwrzyV1FStwa7m.bQC', 'employer'),
('jobs@eduvision.com', '$2b$10$9M2/nB0uOwwaDkWAmDP8QODRL4ShScvSBocwwrzyV1FStwa7m.bQC', 'employer'),
('arjun@email.com', '$2b$10$9M2/nB0uOwwaDkWAmDP8QODRL4ShScvSBocwwrzyV1FStwa7m.bQC', 'jobseeker'),
('priya@email.com', '$2b$10$9M2/nB0uOwwaDkWAmDP8QODRL4ShScvSBocwwrzyV1FStwa7m.bQC', 'jobseeker'),
('ravi@email.com', '$2b$10$9M2/nB0uOwwaDkWAmDP8QODRL4ShScvSBocwwrzyV1FStwa7m.bQC', 'jobseeker');

-- =====================
-- EMPLOYERS
-- =====================
INSERT INTO employers (user_id, company_name, industry, company_size,
  has_accessibility_policy, remote_work_available, accommodation_budget,
  disability_training, accessible_workspace, flexible_hours,
  accessibility_score, audit_done)
VALUES
(2, 'TechCorp India', 'Technology', '201-500',
  true, true, '5k-20k', true, true, false, 72, true),
(3, 'HealthPlus Solutions', 'Healthcare', '51-200',
  true, false, 'under_5k', false, true, true, 55, true),
(4, 'EduVision', 'Education', '11-50',
  false, true, 'none', false, false, true, 25, true);

-- =====================
-- JOB SEEKERS
-- =====================
INSERT INTO job_seekers (user_id, full_name, disability_type,
  functional_abilities, skills, experience_years, education_level,
  preferred_work_mode, ability_score, assessment_done)
VALUES
(5, 'Arjun Mehta', 'Visual',
  '{"typing_wpm":65,"stress_tolerance":"medium","communication":"written","mobility":"seated","auditory_processing":"normal"}',
  ARRAY['Python','SQL','Excel','Data Visualization'],
  3, 'Bachelor''s', 'remote', 78, true),
(6, 'Priya Sharma', 'Mobility',
  '{"typing_wpm":80,"stress_tolerance":"high","communication":"written","mobility":"seated","auditory_processing":"normal"}',
  ARRAY['React','JavaScript','CSS','Communication'],
  2, 'Bachelor''s', 'remote', 82, true),
(7, 'Ravi Kumar', 'Hearing',
  '{"typing_wpm":55,"stress_tolerance":"low","communication":"written","mobility":"fully_mobile","auditory_processing":"partial"}',
  ARRAY['Excel','Data Entry','Attention to Detail'],
  1, 'Diploma', 'remote', 61, true);

-- =====================
-- JOBS (10 postings)
-- =====================
INSERT INTO jobs (employer_id, title, description, required_skills,
  required_abilities, work_mode, salary_range, is_anonymous_hiring)
VALUES
(1, 'Data Analyst', 'Analyze business data using Python and SQL to drive data-informed decisions across the organization.',
  ARRAY['Python','SQL','Excel','Data Visualization'],
  '{"seated_work":true,"screen_reader_compatible":true}',
  'remote', '₹6L–10L', true),
(1, 'QA Tester', 'Test web applications for quality, accessibility compliance, and cross-browser compatibility.',
  ARRAY['Manual Testing','Selenium','Communication'],
  '{"seated_work":true,"no_time_pressure":true}',
  'hybrid', '₹3L–6L', true),
(2, 'Medical Records Assistant', 'Maintain and organize digital patient records with accuracy and confidentiality.',
  ARRAY['Excel','Data Entry','Communication','Attention to Detail'],
  '{"seated_work":true,"written_communication":true}',
  'onsite', '₹3L–6L', false),
(3, 'Content Writer', 'Create accessible educational content for online learners across multiple platforms.',
  ARRAY['Writing','Research','SEO','Communication'],
  '{"seated_work":true,"written_communication":true,"remote_tools":true}',
  'remote', '₹3L–6L', true),
(1, 'Machine Learning Engineer', 'Build and deploy ML models for product recommendations and user personalization.',
  ARRAY['Python','Machine Learning','TensorFlow','SQL'],
  '{"seated_work":true,"remote_tools":true}',
  'remote', '₹10L–20L', true),
(1, 'Business Analyst', 'Bridge business needs with technical solutions through data analysis and stakeholder communication.',
  ARRAY['Excel','PowerBI','Communication','SQL'],
  '{"seated_work":true,"written_communication":true}',
  'hybrid', '₹6L–10L', true),
(2, 'Transcription Specialist', 'Transcribe audio medical records accurately with attention to medical terminology.',
  ARRAY['Typing','Attention to Detail','Medical Terminology'],
  '{"seated_work":true,"no_time_pressure":true}',
  'remote', 'Under ₹3L', true),
(3, 'Online Tutor', 'Teach students online using digital tools and adaptive learning methodologies.',
  ARRAY['Communication','Teaching','Subject Expertise'],
  '{"remote_tools":true,"flexible_schedule":true}',
  'remote', '₹3L–6L', false),
(1, 'Frontend Developer', 'Build accessible, responsive web interfaces using React and modern JavaScript frameworks.',
  ARRAY['React','JavaScript','CSS','Accessibility'],
  '{"seated_work":true,"remote_tools":true}',
  'remote', '₹6L–10L', true),
(2, 'Customer Support Specialist', 'Handle written customer queries via email and chat with empathy and efficiency.',
  ARRAY['Communication','Empathy','Excel','CRM'],
  '{"seated_work":true,"written_communication":true}',
  'remote', '₹3L–6L', true);

-- =====================
-- APPLICATIONS
-- =====================
INSERT INTO applications (job_id, seeker_id, match_score, status, disability_revealed) VALUES
(1, 1, 0.84, 'shortlisted', true),
(9, 2, 0.88, 'interview', true),
(5, 1, 0.72, 'applied', false),
(4, 3, 0.65, 'applied', false),
(6, 1, 0.76, 'applied', false),
(10, 3, 0.58, 'applied', false);

-- =====================
-- ASSESSMENTS
-- =====================
INSERT INTO assessments (seeker_id, responses, scores) VALUES
(1, '{"education_level":"bachelors","experience_years":3,"typing_wpm":65,"stress_tolerance":"medium","communication":"written","mobility":"seated","work_preference":"remote","skills":["Python","SQL","Excel","Data Visualization"],"disability_type":"Visual"}',
 '{"ability_score":78,"typing_percentile":81,"stress_resilience":70,"communication_score":75,"overall_readiness":78}'),
(2, '{"education_level":"bachelors","experience_years":2,"typing_wpm":80,"stress_tolerance":"high","communication":"written","mobility":"seated","work_preference":"remote","skills":["React","JavaScript","CSS","Communication"],"disability_type":"Mobility"}',
 '{"ability_score":82,"typing_percentile":100,"stress_resilience":90,"communication_score":80,"overall_readiness":82}'),
(3, '{"education_level":"diploma","experience_years":1,"typing_wpm":55,"stress_tolerance":"low","communication":"written","mobility":"fully_mobile","work_preference":"remote","skills":["Excel","Data Entry","Attention to Detail"],"disability_type":"Hearing"}',
 '{"ability_score":61,"typing_percentile":69,"stress_resilience":50,"communication_score":70,"overall_readiness":61}');
