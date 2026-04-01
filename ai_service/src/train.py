"""
Train the job matching TF-IDF model.
Run once to generate models/tfidf.pkl.
Usage: python src/train.py
"""
import os
import sys
import numpy as np
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

MODEL_DIR = os.getenv("MODEL_DIR", "./models/")

# Full skills pool
ALL_SKILLS = [
    "Python", "SQL", "Excel", "Data Visualization", "React", "JavaScript",
    "CSS", "Communication", "Machine Learning", "TensorFlow", "Manual Testing",
    "Selenium", "Data Entry", "Attention to Detail", "Writing", "Research",
    "SEO", "PowerBI", "Typing", "Medical Terminology", "Teaching",
    "Subject Expertise", "Accessibility", "Empathy", "CRM", "Java",
    "Node.js", "Docker", "AWS", "HTML", "Leadership", "Tableau",
    "Project Management", "Agile", "JIRA", "Spring Boot", "PostgreSQL",
    "Financial Modeling", "Figma", "Adobe XD", "UI/UX Design"
]


def generate_synthetic_pairs(n=100):
    """Generate n synthetic seeker+job skill text pairs for TF-IDF training."""
    texts = []
    for _ in range(n):
        # Random seeker skills (2-6 skills)
        n_skills = np.random.randint(2, 7)
        seeker_skills = list(np.random.choice(ALL_SKILLS, size=n_skills, replace=False))
        texts.append(" ".join(seeker_skills).lower())
        
        # Random job skills (2-5 skills)
        n_req = np.random.randint(2, 6)
        job_skills = list(np.random.choice(ALL_SKILLS, size=n_req, replace=False))
        texts.append(" ".join(job_skills).lower())
    
    return texts


def train():
    """Train TF-IDF vectorizer on synthetic skill text pairs."""
    print("Training TF-IDF model for job matching...")
    
    # Generate training data
    texts = generate_synthetic_pairs(100)
    print(f"Generated {len(texts)} skill text samples")
    
    # Fit TF-IDF vectorizer
    vectorizer = TfidfVectorizer(max_features=200)
    vectorizer.fit(texts)
    
    # Save model
    os.makedirs(MODEL_DIR, exist_ok=True)
    model_path = os.path.join(MODEL_DIR, "tfidf.pkl")
    joblib.dump(vectorizer, model_path)
    
    print(f"TF-IDF model saved to {model_path}")
    print(f"   Vocabulary size: {len(vectorizer.vocabulary_)}")
    print(f"   Feature names sample: {vectorizer.get_feature_names_out()[:10].tolist()}")
    
    # Quick validation
    test_seeker = "python sql excel data visualization"
    test_job = "python sql machine learning tensorflow"
    test_matrix = vectorizer.transform([test_seeker, test_job])
    from sklearn.metrics.pairwise import cosine_similarity
    sim = cosine_similarity(test_matrix[0:1], test_matrix[1:2])[0][0]
    print(f"   Sample similarity (Python+SQL seeker vs Python+SQL+ML job): {sim:.3f}")


if __name__ == "__main__":
    train()
