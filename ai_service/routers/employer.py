from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
import json
import os

router = APIRouter()

WEIGHTS = {
    "has_accessibility_policy": 20,
    "remote_work_available": 15,
    "disability_training": 20,
    "accessible_workspace": 10,
    "flexible_hours": 10
}

BUDGET_SCORES = {
    "none": 0,
    "under_5k": 5,
    "5k-20k": 15,
    "over_20k": 25
}


class EmployerScoreRequest(BaseModel):
    has_accessibility_policy: bool = False
    remote_work_available: bool = False
    accommodation_budget: str = "none"
    disability_training: bool = False
    accessible_workspace: bool = False
    flexible_hours: bool = False


@router.post("/employer-score")
def calculate_employer_score(request: EmployerScoreRequest):
    """Calculate employer readiness score using weighted rule-based scoring."""
    
    score = 0
    strengths = []
    improvement_areas = []
    
    # Boolean dimensions
    bool_fields = {
        "has_accessibility_policy": request.has_accessibility_policy,
        "remote_work_available": request.remote_work_available,
        "disability_training": request.disability_training,
        "accessible_workspace": request.accessible_workspace,
        "flexible_hours": request.flexible_hours
    }
    
    for key, value in bool_fields.items():
        if value:
            score += WEIGHTS[key]
            strengths.append(key)
        else:
            improvement_areas.append(key)
    
    # Budget (tiered string)
    budget_key = request.accommodation_budget or "none"
    budget_score = BUDGET_SCORES.get(budget_key, 0)
    score += budget_score
    
    if budget_score >= 15:
        strengths.append("accommodation_budget")
    else:
        improvement_areas.append("accommodation_budget")
    
    # Grade per spec: A>=80, B>=60, C>=40, D<40
    if score >= 80:
        grade = "A"
    elif score >= 60:
        grade = "B"
    elif score >= 40:
        grade = "C"
    else:
        grade = "D"
    
    # Recommendations
    RECOMMENDATIONS = {
        "has_accessibility_policy": "Develop and publish a formal disability accessibility policy for your organization.",
        "remote_work_available": "Implement remote work options to expand your talent pool and accommodate diverse needs.",
        "accommodation_budget": "Contact the Job Accommodation Network (askjan.org) for cost-effective accommodation options.",
        "disability_training": "Enroll your HR team in a disability awareness training program (e.g. NASSCOM Foundation).",
        "accessible_workspace": "Commission a professional physical accessibility audit of your workspace.",
        "flexible_hours": "Consider introducing flexible working hours for employees who need schedule accommodation."
    }
    
    recommendations = [RECOMMENDATIONS[area] for area in improvement_areas if area in RECOMMENDATIONS]
    
    return {
        "readiness_score": score,
        "grade": grade,
        "strengths": strengths,
        "improvement_areas": improvement_areas,
        "recommendations": recommendations
    }
