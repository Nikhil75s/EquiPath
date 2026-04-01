# EquiPath AI Service

AI/ML microservice for the EquiPath inclusive career ecosystem.

## Features

1. **Job Matching** (`POST /match`) — Ability-based job matching using cosine similarity
2. **Skill Gap Analysis** (`POST /skill-gap`) — Identifies missing skills with course recommendations
3. **Employer Readiness Score** (`POST /employer-score`) — Rule-based inclusion audit scoring

## Setup

### 1. Install Dependencies
```bash
cd ai_service
pip install -r requirements.txt
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Train Models (Optional)
```bash
python src/train_matching.py
python src/train_skill_gap.py
```
> Models will use synthetic data if PostgreSQL is unavailable.

### 4. Start the Service
```bash
uvicorn main:app --reload --port 8000
```

### 5. Test Endpoints
```bash
# Job Matching
curl -X POST http://localhost:8000/match \
  -H "Content-Type: application/json" \
  -d '{"seeker_id":1,"skills":["Python","SQL"],"abilities":{"typing_wpm":50,"stress_tolerance":"high"},"experience_years":3,"work_mode_preference":"remote"}'

# Skill Gap
curl -X POST http://localhost:8000/skill-gap \
  -H "Content-Type: application/json" \
  -d '{"seeker_skills":["Python","Excel"],"job_required_skills":["Python","SQL","Tableau","Communication"]}'

# Employer Score
curl -X POST http://localhost:8000/employer-score \
  -H "Content-Type: application/json" \
  -d '{"has_accessibility_policy":true,"remote_work_available":true,"accommodation_budget":15000,"disability_awareness_training":false,"accessible_physical_space":true,"flexible_working_hours":true}'
```

## API Documentation

Once running, visit http://localhost:8000/docs for interactive Swagger UI.

## Architecture

- **Matching**: Content-based filtering using cosine similarity between TF-IDF skill vectors + one-hot encoded ability vectors
- **Skill Gap**: Set difference analysis with pre-built course recommendation database
- **Employer Score**: Weighted rule-based scoring (no ML model needed)
