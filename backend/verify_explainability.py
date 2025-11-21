import requests
import json

BASE_URL = "http://localhost:8000"

def login():
    try:
        response = requests.post(f"{BASE_URL}/auth/login", data={"username": "demo", "password": "demo123"})
        if response.status_code == 200:
            return response.json()["access_token"]
    except:
        pass
    return None

def verify():
    token = login()
    if not token:
        print("Login failed or server not running")
        return

    headers = {"Authorization": f"Bearer {token}"}
    
    # Test News
    print("Testing News...")
    resp = requests.post(f"{BASE_URL}/predict/news", json={"text": "Some random news text"}, headers=headers)
    data = resp.json()
    reasons = data.get("reasons", [])
    print(f"News Reasons: {reasons}")
    if any("AI Model" in r for r in reasons):
        print("PASS: News has AI reason")
    else:
        print("FAIL: News missing AI reason")

    # Test Review
    print("\nTesting Review...")
    resp = requests.post(f"{BASE_URL}/predict/review", json={"text": "This is a product review."}, headers=headers)
    data = resp.json()
    reasons = data.get("reasons", [])
    print(f"Review Reasons: {reasons}")
    if any("AI Model" in r for r in reasons):
        print("PASS: Review has AI reason")
    else:
        print("FAIL: Review missing AI reason")

    # Test Job
    print("\nTesting Job...")
    resp = requests.post(f"{BASE_URL}/predict/job", json={"text": "Job offer text here."}, headers=headers)
    data = resp.json()
    reasons = data.get("reasons", [])
    print(f"Job Reasons: {reasons}")
    if any("AI Model" in r for r in reasons):
        print("PASS: Job has AI reason")
    else:
        print("FAIL: Job missing AI reason")

if __name__ == "__main__":
    verify()
