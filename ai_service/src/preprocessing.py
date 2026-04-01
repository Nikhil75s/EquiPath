"""
Data preprocessing utilities for EquiPath AI models.
Handles cleaning, encoding, and scaling of job seeker and job posting data.
"""
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler, MultiLabelBinarizer
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib
import os

MODEL_PATH = os.getenv("MODEL_PATH", "./models/")


def encode_abilities(abilities_series: pd.Series) -> pd.DataFrame:
    """One-hot encode categorical ability fields."""
    # Parse JSONB abilities into a DataFrame
    abilities_df = pd.json_normalize(abilities_series.dropna())
    
    categorical_cols = ['stress_tolerance', 'communication', 'mobility', 
                       'auditory_processing', 'visual_processing']
    numerical_cols = ['typing_wpm']
    
    result = pd.DataFrame()
    
    # One-hot encode categorical columns
    for col in categorical_cols:
        if col in abilities_df.columns:
            dummies = pd.get_dummies(abilities_df[col], prefix=col)
            result = pd.concat([result, dummies], axis=1)
    
    # Keep numerical columns as-is
    for col in numerical_cols:
        if col in abilities_df.columns:
            result[col] = pd.to_numeric(abilities_df[col], errors='coerce').fillna(0)
    
    return result


def build_skills_tfidf(skills_series: pd.Series, fit=True, vectorizer=None):
    """Build TF-IDF vectors from skills arrays."""
    # Convert array of skills to single string
    skills_text = skills_series.apply(
        lambda x: ' '.join(x) if isinstance(x, list) else str(x)
    )
    
    if fit:
        vectorizer = TfidfVectorizer(max_features=100)
        tfidf_matrix = vectorizer.fit_transform(skills_text)
        return tfidf_matrix, vectorizer
    else:
        tfidf_matrix = vectorizer.transform(skills_text)
        return tfidf_matrix, vectorizer


def preprocess_seekers(seekers_df: pd.DataFrame):
    """Preprocess job seeker data for matching."""
    # Encode abilities
    abilities_encoded = encode_abilities(seekers_df['functional_abilities'])
    
    # TF-IDF on skills
    tfidf_matrix, vectorizer = build_skills_tfidf(seekers_df['skills'])
    tfidf_df = pd.DataFrame(
        tfidf_matrix.toarray(),
        columns=[f'skill_{i}' for i in range(tfidf_matrix.shape[1])]
    )
    
    # Normalize experience
    scaler = StandardScaler()
    exp_scaled = scaler.fit_transform(seekers_df[['experience_years']].fillna(0))
    exp_df = pd.DataFrame(exp_scaled, columns=['experience_scaled'])
    
    # Combine all features
    features = pd.concat([abilities_encoded.reset_index(drop=True), 
                          tfidf_df.reset_index(drop=True),
                          exp_df.reset_index(drop=True)], axis=1)
    
    return features, vectorizer, scaler


def preprocess_jobs(jobs_df: pd.DataFrame, vectorizer=None, scaler=None):
    """Preprocess job data for matching."""
    # Encode required abilities
    abilities_encoded = encode_abilities(jobs_df['required_abilities'])
    
    # Use existing vectorizer for skills
    tfidf_matrix, _ = build_skills_tfidf(jobs_df['required_skills'], fit=False, vectorizer=vectorizer)
    tfidf_df = pd.DataFrame(
        tfidf_matrix.toarray(),
        columns=[f'skill_{i}' for i in range(tfidf_matrix.shape[1])]
    )
    
    features = pd.concat([abilities_encoded.reset_index(drop=True),
                          tfidf_df.reset_index(drop=True)], axis=1)
    
    return features


def save_models(vectorizer, scaler, path=None):
    """Save trained models to disk."""
    save_path = path or MODEL_PATH
    os.makedirs(save_path, exist_ok=True)
    joblib.dump(vectorizer, os.path.join(save_path, 'vectorizer.pkl'))
    joblib.dump(scaler, os.path.join(save_path, 'scaler.pkl'))
    print(f"✅ Models saved to {save_path}")


def load_models(path=None):
    """Load trained models from disk."""
    load_path = path or MODEL_PATH
    vectorizer = joblib.load(os.path.join(load_path, 'vectorizer.pkl'))
    scaler = joblib.load(os.path.join(load_path, 'scaler.pkl'))
    return vectorizer, scaler
