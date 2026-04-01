"""
Train the job matching model using cosine similarity on combined feature vectors.
Connects to PostgreSQL to pull job seekers and jobs data.
"""
import os
import sys
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv
import joblib

load_dotenv()

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from src.preprocessing import preprocess_seekers, save_models

MODEL_PATH = os.getenv("MODEL_PATH", "./models/")

def generate_synthetic_data():
    """Generate synthetic training data if database is unavailable."""
    print("📊 Generating synthetic training data...")
    
    seekers = pd.DataFrame({
        'id': range(1, 21),
        'functional_abilities': [
            {"typing_wpm": np.random.randint(30, 80), 
             "stress_tolerance": np.random.choice(["low", "medium", "high"]),
             "communication": np.random.choice(["verbal", "written", "both"]),
             "mobility": np.random.choice(["full", "seated", "limited"]),
             "auditory_processing": np.random.choice(["normal", "partial", "sign_language"]),
             "visual_processing": np.random.choice(["normal", "low_vision", "screen_reader"])}
            for _ in range(20)
        ],
        'skills': [
            list(np.random.choice(
                ["Python", "JavaScript", "Java", "SQL", "React", "Node.js", 
                 "Excel", "Data Analysis", "Machine Learning", "Docker",
                 "HTML", "CSS", "ARIA", "Project Management", "Agile",
                 "Figma", "Communication", "AWS", "PostgreSQL", "Spring Boot"],
                size=np.random.randint(2, 6), replace=False
            )) for _ in range(20)
        ],
        'experience_years': np.random.randint(0, 10, size=20)
    })
    
    jobs = pd.DataFrame({
        'id': range(1, 16),
        'required_abilities': [
            {"typing_wpm": np.random.randint(30, 60),
             "stress_tolerance": np.random.choice(["low", "medium", "high"]),
             "communication": np.random.choice(["verbal", "written", "any"]),
             "mobility": np.random.choice(["any", "seated", "full"])}
            for _ in range(15)
        ],
        'required_skills': [
            list(np.random.choice(
                ["Python", "JavaScript", "Java", "SQL", "React", "Node.js",
                 "Excel", "Data Analysis", "Machine Learning", "Docker",
                 "HTML", "CSS", "Communication", "AWS", "Figma"],
                size=np.random.randint(2, 5), replace=False
            )) for _ in range(15)
        ]
    })
    
    return seekers, jobs


def train():
    """Train the job matching model."""
    print("🚀 Training job matching model...")
    
    try:
        import psycopg2
        conn = psycopg2.connect(os.getenv("DATABASE_URL"))
        seekers = pd.read_sql("SELECT id, functional_abilities, skills, experience_years FROM job_seekers", conn)
        jobs = pd.read_sql("SELECT id, required_abilities, required_skills FROM jobs WHERE is_active = true", conn)
        conn.close()
        print(f"📦 Loaded {len(seekers)} seekers and {len(jobs)} jobs from database")
    except Exception as e:
        print(f"⚠️  Database unavailable: {e}")
        seekers, jobs = generate_synthetic_data()
        print(f"📦 Generated {len(seekers)} synthetic seekers and {len(jobs)} jobs")
    
    if len(seekers) == 0 or len(jobs) == 0:
        print("❌ Not enough data to train. Add more records.")
        return
    
    # Preprocess seekers
    seeker_features, vectorizer, scaler = preprocess_seekers(seekers)
    
    # Save models
    save_models(vectorizer, scaler, MODEL_PATH)
    
    print(f"✅ Model training complete!")
    print(f"   Feature dimensions: {seeker_features.shape}")
    print(f"   Models saved to: {MODEL_PATH}")
    
    # Compute sample similarity matrix
    if len(seeker_features) > 1:
        sim_matrix = cosine_similarity(seeker_features.fillna(0))
        print(f"   Sample similarity range: [{sim_matrix.min():.3f}, {sim_matrix.max():.3f}]")


if __name__ == "__main__":
    train()
