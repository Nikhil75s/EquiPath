from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import json
import os

router = APIRouter()

# Load courses from JSON file
COURSES_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "courses.json")
try:
    with open(COURSES_PATH, "r", encoding="utf-8") as f:
        COURSES_DB = json.load(f)
    print(f"✅ Loaded {len(COURSES_DB)} courses from courses.json")
except Exception as e:
    print(f"⚠️  Could not load courses.json: {e}")
    COURSES_DB = {}

# Build case-insensitive lookup
COURSES_LOOKUP = {k.lower(): {**v, "skill": k} for k, v in COURSES_DB.items()}

DEFAULT_COURSE = {
    "name": "Self-Study Resources",
    "platform": "Various",
    "duration": "10 hrs",
    "url": "https://www.google.com/search?q=learn+"
}


class SkillGapRequest(BaseModel):
    seeker_skills: List[str] = []
    job_required_skills: List[str] = []


@router.post("/skill-gap")
def analyze_skill_gap(request: SkillGapRequest):
    """Analyze the gap between a seeker's skills and job requirements."""
    
    seeker_lower = set(s.lower().strip() for s in request.seeker_skills)
    required = [s.strip() for s in request.job_required_skills]
    
    missing_skills = [s for s in required if s.lower() not in seeker_lower]
    
    gap_score = len(missing_skills) / len(required) if required else 0
    gap_score = round(gap_score, 2)
    
    # Generate course recommendations
    recommended_courses = []
    for skill in missing_skills:
        course_info = COURSES_LOOKUP.get(skill.lower())
        if course_info:
            recommended_courses.append({
                "skill": skill,
                "name": course_info["name"],
                "platform": course_info["platform"],
                "duration": course_info["duration"],
                "url": course_info["url"]
            })
        else:
            recommended_courses.append({
                "skill": skill,
                "name": f"Learn {skill}",
                "platform": DEFAULT_COURSE["platform"],
                "duration": DEFAULT_COURSE["duration"],
                "url": f"{DEFAULT_COURSE['url']}{skill.replace(' ', '+')}"
            })
    
    return {
        "gap_score": gap_score,
        "gap_percentage": round(gap_score * 100),
        "missing_skills": missing_skills,
        "recommended_courses": recommended_courses,
        "matched_skills": [s for s in required if s.lower() in seeker_lower],
        "coverage_percentage": round((1 - gap_score) * 100, 1)
    }
