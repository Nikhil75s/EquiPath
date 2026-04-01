"""
Employer Readiness Scoring — Rule-based scoring system.
No ML model needed. Pure weighted scoring logic.
"""
from typing import Dict, List, Tuple

WEIGHTS = {
    "has_accessibility_policy": 20,
    "remote_work_available": 15,
    "accommodation_budget_tier": 25,
    "disability_awareness_training": 20,
    "accessible_physical_space": 10,
    "flexible_working_hours": 10,
}

BUDGET_TIERS = [
    (20000, 25, "Excellent budget for accommodations"),
    (5000, 15, "Moderate budget — consider expanding"),
    (0, 5, "Limited budget — explore low-cost accommodations"),
]

GRADES = [
    (90, "A", "Excellent — Industry leader in inclusion"),
    (80, "B", "Good — Strong commitment to accessibility"),
    (70, "C", "Adequate — Room for improvement"),
    (60, "D", "Below Average — Significant gaps"),
    (0, "F", "Poor — Major improvements needed"),
]


def calculate_readiness_score(audit_data: Dict) -> Dict:
    """Calculate employer readiness score from audit responses."""
    score = 0
    strengths = []
    improvement_areas = []
    
    # Boolean factors
    bool_factors = [
        "has_accessibility_policy",
        "remote_work_available",
        "disability_awareness_training",
        "accessible_physical_space",
        "flexible_working_hours",
    ]
    
    for factor in bool_factors:
        if audit_data.get(factor, False):
            score += WEIGHTS.get(factor, 0)
            strengths.append(factor)
        else:
            improvement_areas.append(factor)
    
    # Budget tier
    budget = float(audit_data.get("accommodation_budget", 0))
    for threshold, points, _ in BUDGET_TIERS:
        if budget >= threshold:
            score += points
            if points >= 15:
                strengths.append("accommodation_budget")
            else:
                improvement_areas.append("accommodation_budget")
            break
    
    # Grade
    grade = "F"
    grade_description = ""
    for threshold, g, desc in GRADES:
        if score >= threshold:
            grade = g
            grade_description = desc
            break
    
    return {
        "readiness_score": score,
        "grade": grade,
        "grade_description": grade_description,
        "strengths": strengths,
        "improvement_areas": improvement_areas,
        "max_possible_score": sum(WEIGHTS.values()),
    }
