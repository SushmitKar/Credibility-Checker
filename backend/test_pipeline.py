import requests
import json

BASE_URL = "http://localhost:8000"

# Login to get token
def login():
    response = requests.post(f"{BASE_URL}/auth/login", data={"username": "demo", "password": "demo123"})
    if response.status_code == 200:
        return response.json()["access_token"]
    else:
        print("Login failed")
        return None

def test_news(token):
    print("\nTesting News Prediction...")
    # Using a known claim for better fact check detection
    text = "Earth 15 days of darkness"
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(f"{BASE_URL}/predict/news", json={"text": text}, headers=headers)
    if response.status_code == 200:
        data = response.json()
        print(f"Input: {text}")
        print(f"Prediction: {data['label']}")
        print(f"Confidence: {data['confidence']}")
        print(f"Reasons: {data['reasons']}")
        
        # Verify rules triggered
        if any("Suspicious keyword detected" in r for r in data['reasons']):
            print("[PASS] Rule triggered successfully")
        else:
            print("[FAIL] Rule NOT triggered")
            
        # Verify API called (might fail if API key is invalid or rate limited, but we check for reason)
        if any("MediaBiasFactCheck" in r for r in data['reasons']) or any("Fact-check error" in r for r in data['reasons']):
             print("[PASS] Fact-check attempted")
        else:
             print("[FAIL] Fact-check NOT attempted")

        # Verify Google Fact Check
        if any("Google Fact Check" in r for r in data['reasons']):
             print("[PASS] Google Fact Check triggered")
        else:
             print("[FAIL] Google Fact Check NOT triggered (might be no claim found)")

    else:
        print(f"Error: {response.text}")

def test_review(token):
    print("\nTesting Review Prediction...")
    text = "Best product ever! Absolutely amazing! Buy it now!"
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(f"{BASE_URL}/predict/review", json={"text": text}, headers=headers)
    if response.status_code == 200:
        data = response.json()
        print(f"Input: {text}")
        print(f"Prediction: {data['label']}")
        print(f"Confidence: {data['confidence']}")
        print(f"Reasons: {data['reasons']}")
        
        if any("Exaggerated phrase" in r for r in data['reasons']):
             print("[PASS] Rule triggered successfully")
        else:
             print("[FAIL] Rule NOT triggered")
    else:
        print(f"Error: {response.text}")

def test_job(token):
    print("\nTesting Job Prediction...")
    text = "Earn 50,000 per week. No experience needed. Send bank details for registration fee."
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(f"{BASE_URL}/predict/job", json={"text": text}, headers=headers)
    if response.status_code == 200:
        data = response.json()
        print(f"Input: {text}")
        print(f"Prediction: {data['label']}")
        print(f"Confidence: {data['confidence']}")
        print(f"Reasons: {data['reasons']}")
        
        if any("Scam indicator" in r for r in data['reasons']):
             print("[PASS] Rule triggered successfully")
        else:
             print("[FAIL] Rule NOT triggered")
    else:
        print(f"Error: {response.text}")

if __name__ == "__main__":
    token = login()
    if token:
        test_news(token)
        test_review(token)
        test_job(token)
