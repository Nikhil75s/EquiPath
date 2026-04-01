-- EquiPath Database Schema
-- PostgreSQL 15

-- Drop existing tables (in dependency order)
DROP TABLE IF EXISTS skill_gaps CASCADE;
DROP TABLE IF EXISTS assessments CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS employers CASCADE;
DROP TABLE IF EXISTS job_seekers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS (all roles)
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  role        VARCHAR(20) CHECK (role IN ('jobseeker','employer','admin')) NOT NULL,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- JOB SEEKERS profile
CREATE TABLE job_seekers (
  id                   SERIAL PRIMARY KEY,
  user_id              INT REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  full_name            VARCHAR(100),
  disability_type      VARCHAR(100),
  functional_abilities JSONB DEFAULT '{}',
  skills               TEXT[] DEFAULT '{}',
  experience_years     INT DEFAULT 0,
  education_level      VARCHAR(50),
  preferred_work_mode  VARCHAR(20) DEFAULT 'remote',
  ability_score        FLOAT DEFAULT 0,
  assessment_done      BOOLEAN DEFAULT FALSE,
  created_at           TIMESTAMP DEFAULT NOW()
);

-- EMPLOYERS
CREATE TABLE employers (
  id                       SERIAL PRIMARY KEY,
  user_id                  INT REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  company_name             VARCHAR(200),
  industry                 VARCHAR(100),
  company_size             VARCHAR(50),
  accessibility_score      FLOAT DEFAULT 0,
  has_accessibility_policy BOOLEAN DEFAULT FALSE,
  remote_work_available    BOOLEAN DEFAULT FALSE,
  accommodation_budget     VARCHAR(50) DEFAULT 'none',
  disability_training      BOOLEAN DEFAULT FALSE,
  accessible_workspace     BOOLEAN DEFAULT FALSE,
  flexible_hours           BOOLEAN DEFAULT FALSE,
  audit_done               BOOLEAN DEFAULT FALSE,
  created_at               TIMESTAMP DEFAULT NOW()
);

-- JOBS
CREATE TABLE jobs (
  id                  SERIAL PRIMARY KEY,
  employer_id         INT REFERENCES employers(id) ON DELETE CASCADE,
  title               VARCHAR(200) NOT NULL,
  description         TEXT,
  required_skills     TEXT[] DEFAULT '{}',
  required_abilities  JSONB DEFAULT '{}',
  work_mode           VARCHAR(20) DEFAULT 'remote',
  salary_range        VARCHAR(50),
  is_anonymous_hiring BOOLEAN DEFAULT TRUE,
  is_active           BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMP DEFAULT NOW()
);

-- APPLICATIONS (anonymous first stage)
CREATE TABLE applications (
  id                  SERIAL PRIMARY KEY,
  job_id              INT REFERENCES jobs(id) ON DELETE CASCADE,
  seeker_id           INT REFERENCES job_seekers(id) ON DELETE CASCADE,
  match_score         FLOAT DEFAULT 0,
  status              VARCHAR(30) DEFAULT 'applied'
                      CHECK (status IN ('applied','shortlisted','interview','offer','rejected')),
  disability_revealed BOOLEAN DEFAULT FALSE,
  applied_at          TIMESTAMP DEFAULT NOW(),
  UNIQUE(job_id, seeker_id)
);

-- ASSESSMENTS
CREATE TABLE assessments (
  id         SERIAL PRIMARY KEY,
  seeker_id  INT REFERENCES job_seekers(id) ON DELETE CASCADE,
  responses  JSONB NOT NULL,
  scores     JSONB,
  taken_at   TIMESTAMP DEFAULT NOW()
);

-- SKILL GAP RECORDS
CREATE TABLE skill_gaps (
  id                   SERIAL PRIMARY KEY,
  seeker_id            INT REFERENCES job_seekers(id),
  job_id               INT REFERENCES jobs(id),
  missing_skills       TEXT[] DEFAULT '{}',
  recommended_courses  JSONB DEFAULT '[]',
  gap_score            FLOAT DEFAULT 0,
  created_at           TIMESTAMP DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_jobs_employer    ON jobs(employer_id);
CREATE INDEX idx_apps_job         ON applications(job_id);
CREATE INDEX idx_apps_seeker      ON applications(seeker_id);
CREATE INDEX idx_seeker_user      ON job_seekers(user_id);
CREATE INDEX idx_employer_user    ON employers(user_id);
