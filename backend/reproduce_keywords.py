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
    
    # Test News with multiple keywords
    # Keywords: "miracle", "secret", "aliens"
    text = "This is a secret miracle that aliens brought to us."
    print(f"\nTesting News with text: '{text}'")
    resp = requests.post(f"{BASE_URL}/predict/news", json={"text": text}, headers=headers)
    data = resp.json()
    reasons = data.get("reasons", [])
    print(f"Reasons: {json.dumps(reasons, indent=2)}")

if __name__ == "__main__":
    verify()
