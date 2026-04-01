from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, List, Optional
import numpy as np
import os
import json
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

router = APIRouter()

# Try to load pre-trained TF-IDF vectorizer
tfidf_vectorizer = None
MODEL_DIR = os.getenv("MODEL_DIR", "./models/")

try:
    tfidf_vectorizer = joblib.load(os.path.join(MODEL_DIR, "tfidf.pkl"))
    print("✅ Loaded pre-trained TF-IDF vectorizer")
except Exception:
    print("⚠️  No pre-trained TF-IDF model found, will use on-the-fly vectorization")


class SeekerProfile(BaseModel):
    skills: List[str] = []
    functional_abilities: Dict = {}
    experience_years: int = 0
    preferred_work_mode: str = "remote"


class JobInfo(BaseModel):
    id: int
    title: str = ""
    required_skills: List[str] = []
    required_abilities: Dict = {}
    work_mode: str = "remote"
    employer_name: str = ""


class MatchRequest(BaseModel):
    seeker: SeekerProfile
    jobs: List[JobInfo] = []


@router.post("/match")
def match_jobs(request: MatchRequest):
    """Match a job seeker to jobs using TF-IDF + cosine similarity on skills, plus ability matching."""
    
    if not request.jobs:
        return {"matches": []}
    
    seeker = request.seeker
    jobs = request.jobs
    
    # Build skill text for TF-IDF
    seeker_skills_text = " ".join(seeker.skills).lower()
    job_skills_texts = [" ".join(j.required_skills).lower() for j in jobs]
    
    # Compute TF-IDF cosine similarity
    all_texts = [seeker_skills_text] + job_skills_texts
    
    try:
        if tfidf_vectorizer is not None:
            tfidf_matrix = tfidf_vectorizer.transform(all_texts)
        else:
            vectorizer = TfidfVectorizer()
            tfidf_matrix = vectorizer.fit_transform(all_texts)
        
        # Cosine similarity between seeker (index 0) and each job
        seeker_vector = tfidf_matrix[0:1]
        job_vectors = tfidf_matrix[1:]
        
        if job_vectors.shape[0] > 0:
            cos_scores = cosine_similarity(seeker_vector, job_vectors)[0]
        else:
            cos_scores = np.zeros(len(jobs))
    except Exception:
        # Fallback to simple overlap
        cos_scores = np.array([
            compute_skill_overlap(seeker.skills, j.required_skills) for j in jobs
        ])
    
    results = []
    for i, job in enumerate(jobs):
        skill_score = float(cos_scores[i]) if i < len(cos_scores) else 0.0
        
        # Ability match
        ability_score, matching_abilities = compute_ability_match(
            seeker.functional_abilities, job.required_abilities
        )
        
        # Work mode bonus
        work_mode_bonus = 0.1 if seeker.preferred_work_mode == job.work_mode else 0
        
        # Experience factor
        exp_factor = min(seeker.experience_years / 10, 0.1) if seeker.experience_years > 0 else 0
        
        # Combined score: weighted
        combined = (skill_score * 0.5) + (ability_score * 0.25) + work_mode_bonus + exp_factor
        combined = min(round(combined, 2), 1.0)
        combined = max(combined, 0.0)
        
        # Compute match factors
        match_factors = []
        seeker_lower = set(s.lower() for s in seeker.skills)
        for rs in job.required_skills:
            if rs.lower() in seeker_lower:
                match_factors.append(rs)
        if work_mode_bonus > 0:
            match_factors.append(f"{job.work_mode} work")
        match_factors.extend(matching_abilities[:3])
        
        results.append({
            "job_id": job.id,
            "match_score": combined,
            "match_percentage": round(combined * 100),
            "match_factors": match_factors[:6]
        })
    
    results.sort(key=lambda x: x["match_score"], reverse=True)
    return {"matches": results[:20]}


def compute_skill_overlap(seeker_skills: List[str], job_skills: List[str]) -> float:
    if not job_skills:
        return 0.5
    seeker_lower = set(s.lower() for s in seeker_skills)
    job_lower = set(s.lower() for s in job_skills)
    intersection = seeker_lower & job_lower
    return len(intersection) / len(job_lower) if job_lower else 0.5


def compute_ability_match(seeker_abilities: Dict, job_abilities: Dict) -> tuple:
    if not job_abilities:
        return 0.5, []
    
    matches = []
    total_checks = 0
    match_count = 0

    for key, req_val in job_abilities.items():
        if isinstance(req_val, bool):
            if req_val:
                total_checks += 1
                match_count += 1
                matches.append(key.replace("_", " "))
            continue
        
        total_checks += 1
        seeker_val = seeker_abilities.get(key)
        
        if seeker_val is None:
            continue
        
        if req_val == "any":
            match_count += 1
            matches.append(key.replace("_", " "))
            continue
        
        if isinstance(req_val, (int, float)):
            if isinstance(seeker_val, (int, float)) and seeker_val >= req_val:
                match_count += 1
                matches.append(key.replace("_", " "))
        else:
            stress_levels = {"low": 1, "medium": 2, "high": 3}
            if key == "stress_tolerance":
                seeker_level = stress_levels.get(str(seeker_val).lower(), 2)
                req_level = stress_levels.get(str(req_val).lower(), 2)
                if seeker_level >= req_level:
                    match_count += 1
                    matches.append(key.replace("_", " "))
            elif str(seeker_val).lower() == str(req_val).lower():
                match_count += 1
                matches.append(key.replace("_", " "))

    score = match_count / total_checks if total_checks > 0 else 0.5
    return score, matches
