import os
import pickle
import torch
import numpy as np
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import joblib
from fastapi import HTTPException
import requests

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

def apply_fake_news_rules(text):
    rules = {
        "fake_keywords": [
            "cure cancer", "miracle", "aliens", "alien", "secret", "government hiding",
            "underground city", "immortality", "teleported", "inside source", "conspiracy",
            "cover up", "truth they don't want you to know", "shocking discovery"
        ]
    }
    score = 0.0
    reasons = []
    found_keywords = []

    for kw in rules["fake_keywords"]:
        if kw in text.lower():
            found_keywords.append(kw)

    if found_keywords:
        # Cap score contribution from keywords
        contribution = min(0.4, len(found_keywords) * 0.15)
        score += contribution
        reasons.append(f"Suspicious keywords detected: {', '.join(f'{k}' for k in found_keywords)} (+{contribution:.0%} risk)")

    return score, reasons

def apply_fake_review_rules(text):
    text_lower = text.lower()
    score = 0.0
    reasons = []

    # 1. Too short
    if len(text.split()) < 8:
        contribution = 0.25
        score += contribution
        reasons.append(f"Review is unusually short (+{contribution:.0%} risk)")

    # 2. Too many exclamation marks
    if text.count("!") >= 3:
        contribution = 0.35
        score += contribution
        reasons.append(f"Multiple exclamation marks detected (+{contribution:.0%} risk)")

    # 3. Excessive positivity
    strong_positive = [
        "best product ever", "perfect", "absolutely perfect",
        "life changing", "amazing amazing", "incredible deal",
        "buy now", "highly recommend to everyone"
    ]
    found_positive = []
    for phrase in strong_positive:
        if phrase in text_lower:
            found_positive.append(phrase)
            
    if found_positive:
        contribution = 0.40
        score += contribution
        reasons.append(f"Exaggerated phrases: {', '.join(f'{p}' for p in found_positive)} (+{contribution:.0%} risk)")

    # 4. All caps segments
    words = text.split()
    if any(len(w) > 3 and w.isupper() for w in words):
        contribution = 0.30
        score += contribution
        reasons.append(f"Contains ALL CAPS shouting (+{contribution:.0%} risk)")

    # 5. Very unnatural repetition
    if len(set(words)) < len(words) * 0.4:
        contribution = 0.25
        score += contribution
        reasons.append(f"Unnatural repetition in review (+{contribution:.0%} risk)")

    return score, reasons

def apply_fake_job_rules(text):
    score = 0.0
    reasons = []

    scam_terms = [
        "registration fee", "send bank details", "earn", "₹", "limited slots",
        "no experience needed", "work from home money", "quick money", "investment",
        "hiring immediately", "urgent hiring"
    ]
    found_scam = []

    for term in scam_terms:
        if term in text.lower():
            found_scam.append(term)
            
    if found_scam:
        contribution = min(0.5, len(found_scam) * 0.20)
        score += contribution
        reasons.append(f"Scam indicators: {', '.join(f'{t}' for t in found_scam)} (+{contribution:.0%} risk)")

    return score, reasons

def check_news_source_with_mbc(text):
    url = "https://mediabiasfactcheck.p.rapidapi.com/search"
    headers = {
        "X-RapidAPI-Key": os.getenv("MBFC_API_KEY"),
        "X-RapidAPI-Host": os.getenv("MBFC_API_HOST")
    }
    query = {"query": text}

    try:
        response = requests.get(url, headers=headers, params=query)
        data = response.json()

        if len(data) == 0:
            return 0.0, ["No matching source in MediaBiasFactCheck"]

        reliability = data[0].get("factual", "Mixed")

        # Convert factual rating into score
        mapping = {
            "High": -0.3,     # reduces fake score
            "Mostly Factual": -0.2,
            "Mixed": 0.0,
            "Low": 0.2,       # increases fake score
            "Very Low": 0.3,
            "Fake News": 0.4,
            "Satire": 0.3
        }

        score = mapping.get(reliability, 0.0)
        sign = "+" if score > 0 else ""
        reason = f"MediaBiasFactCheck rating: {reliability} ({sign}{score:.0%} risk)"

        return score, [reason]

    except Exception as e:
        # API seems to be down or invalid, return empty to not affect score
        return 0.0, []

def check_google_fact_check(text):
    api_key = os.getenv("GOOGLE_API_KEY")
    url = "https://factchecktools.googleapis.com/v1alpha1/claims:search"
    params = {
        "key": api_key,
        "query": text,
        "languageCode": "en"
    }
    
    try:
        response = requests.get(url, params=params)
        data = response.json()
        
        if "claims" not in data or not data["claims"]:
            return 0.0, []
            
        # Analyze the first claim found
        claim = data["claims"][0]
        claim_review = claim.get("claimReview", [])[0] if claim.get("claimReview") else {}
        publisher = claim_review.get("publisher", {}).get("name", "Unknown")
        rating = claim_review.get("textualRating", "Unknown")
        
        score = 0.0
        
        # Simple heuristic for rating
        rating_lower = rating.lower()
        if "false" in rating_lower or "pants on fire" in rating_lower or "fake" in rating_lower:
            score = 0.4 # Strong signal for fake
        elif "true" in rating_lower or "correct" in rating_lower:
            score = -0.4 # Strong signal for real
        elif "mixture" in rating_lower or "misleading" in rating_lower:
            score = 0.2
            
        sign = "+" if score > 0 else ""
        reason = f"Google Fact Check ({publisher}): {rating} ({sign}{score:.0%} risk)"
            
        return score, [reason]

    except Exception as e:
        return 0.0, [f"Google Fact Check error: {str(e)}"]

def predict_news(text: str):
    if not news_model or not news_tokenizer:
        raise HTTPException(status_code=503, detail="News model not loaded")
    
    inputs = news_tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
    with torch.no_grad():
        outputs = news_model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
        confidence, predicted_class = torch.max(probs, dim=-1)
    
    # Assuming 3 classes: 0=True, 1=Misleading, 2=Fake
    labels = ["True", "Misleading", "Fake"] 
    
    # Calculate ML Score (0-1)
    ml_fake_score = 0.0
    if predicted_class.item() == 2: # Fake
        ml_fake_score = float(confidence.item())
    elif predicted_class.item() == 1: # Misleading
        ml_fake_score = 0.5 + (float(confidence.item()) * 0.2)
    else: # True
        ml_fake_score = 1.0 - float(confidence.item())

    ml_reason = f"Base AI Model risk score: {ml_fake_score:.1%}"

    # Apply Rules
    rule_score, rule_reasons = apply_fake_news_rules(text)
    
    # Apply Fact Check (MBC)
    mbc_score, mbc_reasons = check_news_source_with_mbc(text)

    # Apply Google Fact Check
    google_score, google_reasons = check_google_fact_check(text)

    # Final Score Calculation
    final_score = ml_fake_score + rule_score + mbc_score + google_score
    final_score = max(0.0, min(final_score, 1.0))

    prediction = "FAKE" if final_score >= 0.6 else "REAL"
    
    # Override for Science News
    science_keywords = [
        "research", "isro", "nasa", "study", "scientists",
        "experiment", "analysis", "data", "mission"
    ]

    if any(word in text.lower() for word in science_keywords):
        if prediction == "FAKE" and final_score < 0.80:
            prediction = "REAL"
            final_score = round(final_score * 0.5, 3)
            reasons = [ml_reason] + rule_reasons + mbc_reasons + google_reasons
            reasons.append("Scientific report detected — overriding weak fake prediction.")
            return {
                "label": prediction, 
                "confidence": final_score, 
                "reasons": reasons
            }
    
    return {
        "label": prediction, 
        "confidence": final_score, 
        "reasons": [ml_reason] + rule_reasons + mbc_reasons + google_reasons
    }

def predict_review(text: str):
    if not review_rf or not review_tfidf:
        raise HTTPException(status_code=503, detail="Review model not loaded")
    
    # Transform text
    text_vectorized = review_tfidf.transform([text])
    prediction = review_rf.predict(text_vectorized)[0]
    
    try:
        probs = review_rf.predict_proba(text_vectorized)
        confidence = float(np.max(probs))
        # Assuming class 1 is Fake
        ml_fake_score = float(probs[0][1]) if len(probs[0]) > 1 else (1.0 if prediction == 1 else 0.0)
    except:
        confidence = 1.0 # Fallback if predict_proba not available
        ml_fake_score = 1.0 if prediction == 1 else 0.0
        
    ml_label = "Fake" if ml_fake_score > 0.5 else "Real"
    ml_reason = f"Base AI Model risk score: {ml_fake_score:.1%}"

    # Apply Rules
    rule_score, rule_reasons = apply_fake_review_rules(text)

    # Final Score
    final_score = min(1.0, ml_fake_score + rule_score)

    label = "Fake" if final_score >= 0.6 else "Real"
    
    return {
        "label": label, 
        "confidence": final_score,
        "reasons": [ml_reason] + rule_reasons
    }

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
    
    # Calculate ML Fake Score
    ml_fake_score = float(confidence.item()) if predicted_class.item() == 1 else (1.0 - float(confidence.item()))

    ml_reason = f"Base AI Model risk score: {ml_fake_score:.1%}"

    # Apply Rules
    rule_score, rule_reasons = apply_fake_job_rules(text)

    # Final Score
    final_score = ml_fake_score + rule_score
    final_score = max(0.0, min(final_score, 1.0))
    
    label = "Fake" if final_score >= 0.6 else "Real"
    
    return {
        "label": label, 
        "confidence": final_score,
        "reasons": [ml_reason] + rule_reasons
    }
