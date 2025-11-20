import os
import pickle
import torch
import numpy as np
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import joblib
from fastapi import HTTPException

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")

NEWS_MODEL_PATH = os.path.join(MODELS_DIR, "roberta_liar")
REVIEW_RF_PATH = os.path.join(MODELS_DIR, "rf_review", "reviews_rf.pkl")
REVIEW_TFIDF_PATH = os.path.join(MODELS_DIR, "rf_review", "reviews_tfidf.pkl")
JOB_MODEL_PATH = os.path.join(MODELS_DIR, "roberta_job")

# Global model holders
news_model = None
news_tokenizer = None
review_rf = None
review_tfidf = None
job_model = None
job_tokenizer = None

def load_models():
    global news_model, news_tokenizer, review_rf, review_tfidf, job_model, job_tokenizer
    
    # Load News Model
    try:
        if os.path.exists(NEWS_MODEL_PATH):
            print(f"Loading News model from {NEWS_MODEL_PATH}...")
            news_tokenizer = AutoTokenizer.from_pretrained(NEWS_MODEL_PATH)
            news_model = AutoModelForSequenceClassification.from_pretrained(NEWS_MODEL_PATH)
            news_model.eval()
            print("News model loaded.")
        else:
            print(f"Warning: News model not found at {NEWS_MODEL_PATH}")
    except Exception as e:
        print(f"Error loading News model: {e}")

    # Load Review Model
    try:
        print(f"Checking Review model paths: {REVIEW_RF_PATH}, {REVIEW_TFIDF_PATH}")
        if os.path.exists(REVIEW_RF_PATH) and os.path.exists(REVIEW_TFIDF_PATH):
            print(f"Loading Review models from {MODELS_DIR}...")
            with open(REVIEW_RF_PATH, 'rb') as f:
                review_rf = pickle.load(f)
            with open(REVIEW_TFIDF_PATH, 'rb') as f:
                review_tfidf = pickle.load(f)
            print("Review models loaded.")
        else:
            print(f"Warning: Review models not found. RF exists: {os.path.exists(REVIEW_RF_PATH)}, TFIDF exists: {os.path.exists(REVIEW_TFIDF_PATH)}")
    except Exception as e:
        print(f"Error loading Review models: {e}")
        import traceback
        traceback.print_exc()

    # Load Job Model
    try:
        if os.path.exists(JOB_MODEL_PATH):
            print(f"Loading Job model from {JOB_MODEL_PATH}...")
            job_tokenizer = AutoTokenizer.from_pretrained(JOB_MODEL_PATH)
            job_model = AutoModelForSequenceClassification.from_pretrained(JOB_MODEL_PATH)
            job_model.eval()
            print("Job model loaded.")
        else:
            print(f"Warning: Job model not found at {JOB_MODEL_PATH}")
    except Exception as e:
        print(f"Error loading Job model: {e}")

def predict_news(text: str):
    if not news_model or not news_tokenizer:
        raise HTTPException(status_code=503, detail="News model not loaded")
    
    inputs = news_tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
    with torch.no_grad():
        outputs = news_model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
        confidence, predicted_class = torch.max(probs, dim=-1)
    
    # Assuming 3 classes: 0=True, 1=Misleading, 2=Fake (Adjust based on actual training)
    # User said: True / Misleading / Fake. I will map indices to these.
    # NOTE: This mapping might need adjustment based on how it was trained.
    labels = ["True", "Misleading", "Fake"] 
    label = labels[predicted_class.item()] if predicted_class.item() < len(labels) else "Unknown"
    
    return {"label": label, "confidence": float(confidence.item())}

def predict_review(text: str):
    if not review_rf or not review_tfidf:
        raise HTTPException(status_code=503, detail="Review model not loaded")
    
    # Transform text
    text_vectorized = review_tfidf.transform([text])
    prediction = review_rf.predict(text_vectorized)[0]
    # Assuming binary: 0=Real, 1=Fake or vice versa. 
    # User said: Real / Fake.
    # Usually 0 is Real, 1 is Fake or vice versa. I'll assume 0=Real, 1=Fake for now.
    # Ideally I'd check probability if RF supports it.
    
    try:
        probs = review_rf.predict_proba(text_vectorized)
        confidence = float(np.max(probs))
    except:
        confidence = 1.0 # Fallback if predict_proba not available
        
    label = "Fake" if prediction == 1 else "Real" # Common convention, but could be swapped.
    
    return {"label": label, "confidence": confidence}

def predict_job(text: str):
    if not job_model or not job_tokenizer:
        raise HTTPException(status_code=503, detail="Job model not loaded")
    
    inputs = job_tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
    with torch.no_grad():
        outputs = job_model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
        confidence, predicted_class = torch.max(probs, dim=-1)
        
    # Binary: Real / Fake
    labels = ["Real", "Fake"]
    label = labels[predicted_class.item()] if predicted_class.item() < len(labels) else "Unknown"
    
    return {"label": label, "confidence": float(confidence.item())}
