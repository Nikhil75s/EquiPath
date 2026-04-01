"""
Train the skill gap prediction model.
Uses TF-IDF similarity between seeker skills and job requirements.
"""
import os
import sys
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv
import joblib

load_dotenv()

MODEL_PATH = os.getenv("MODEL_PATH", "./models/")


def train():
    """Train skill gap model."""
    print("🚀 Training skill gap model...")
    
    # Build course mapping from known skills
    all_skills = [
        "Python", "JavaScript", "Java", "SQL", "React", "Node.js",
        "Excel", "Data Analysis", "Machine Learning", "Docker",
        "HTML", "CSS", "ARIA", "Project Management", "Agile",
        "Figma", "Communication", "AWS", "PostgreSQL", "Spring Boot",
        "TensorFlow", "Tableau", "Adobe XD", "Accessibility Testing",
        "Financial Modeling", "JIRA", "User Research", "Prototyping"
    ]
    
    # Create TF-IDF vectorizer for skill matching
    vectorizer = TfidfVectorizer()
    vectorizer.fit(all_skills)
    
    os.makedirs(MODEL_PATH, exist_ok=True)
    joblib.dump(vectorizer, os.path.join(MODEL_PATH, "skill_vectorizer.pkl"))
    
    print(f"✅ Skill gap model trained with {len(all_skills)} skills")
    print(f"   Saved to: {MODEL_PATH}skill_vectorizer.pkl")


if __name__ == "__main__":
    train()
