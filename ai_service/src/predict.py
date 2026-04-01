"""
Prediction module: Load saved models and run inference.
"""
import os
import joblib
import numpy as np
from typing import Dict, List

MODEL_PATH = os.getenv("MODEL_PATH", "./models/")


def load_matching_models():
    """Load pre-trained matching models."""
    try:
        vectorizer = joblib.load(os.path.join(MODEL_PATH, "vectorizer.pkl"))
        scaler = joblib.load(os.path.join(MODEL_PATH, "scaler.pkl"))
        return vectorizer, scaler
    except FileNotFoundError:
        return None, None


def predict_match_score(seeker_features: np.ndarray, job_features: np.ndarray) -> float:
    """Compute cosine similarity between seeker and job feature vectors."""
    from sklearn.metrics.pairwise import cosine_similarity
    
    # Ensure same dimensions
    max_features = max(seeker_features.shape[-1], job_features.shape[-1])
    
    if seeker_features.shape[-1] < max_features:
        padding = np.zeros((1, max_features - seeker_features.shape[-1]))
        seeker_features = np.hstack([seeker_features, padding])
    
    if job_features.shape[-1] < max_features:
        padding = np.zeros((1, max_features - job_features.shape[-1]))
        job_features = np.hstack([job_features, padding])
    
    similarity = cosine_similarity(seeker_features.reshape(1, -1), 
                                   job_features.reshape(1, -1))
    return float(similarity[0][0])


def compute_skill_match(seeker_skills: List[str], job_skills: List[str]) -> Dict:
    """Compute skill-based match metrics."""
    seeker_set = set(s.lower() for s in seeker_skills)
    job_set = set(s.lower() for s in job_skills)
    
    matched = seeker_set & job_set
    missing = job_set - seeker_set
    
    coverage = len(matched) / len(job_set) if job_set else 0
    
    return {
        "matched_skills": list(matched),
        "missing_skills": list(missing),
        "coverage": round(coverage, 2),
        "gap_score": round(1 - coverage, 2)
    }
