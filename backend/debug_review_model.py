import os
import pickle
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "..", "models")
REVIEW_RF_PATH = os.path.join(MODELS_DIR, "rf_review", "reviews_rf.pkl")
REVIEW_TFIDF_PATH = os.path.join(MODELS_DIR, "rf_review", "reviews_tfidf.pkl")

print(f"Checking paths:\nRF: {REVIEW_RF_PATH}\nTFIDF: {REVIEW_TFIDF_PATH}")

if not os.path.exists(REVIEW_RF_PATH):
    print("RF model file missing!")
if not os.path.exists(REVIEW_TFIDF_PATH):
    print("TFIDF model file missing!")

try:
    import sklearn
    print(f"sklearn version: {sklearn.__version__}")
    
    import joblib
    print("Loading RF model with joblib...")
    with open(REVIEW_RF_PATH, 'rb') as f:
        rf = joblib.load(f)
    print("RF model loaded successfully.")
    
    print("Loading TFIDF model with joblib...")
    with open(REVIEW_TFIDF_PATH, 'rb') as f:
        tfidf = joblib.load(f)
    print("TFIDF model loaded successfully.")
    
except Exception as e:
    print(f"Error loading models: {e}")
    import traceback
    traceback.print_exc()
