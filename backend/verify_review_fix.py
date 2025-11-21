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
    
    # Test 1: Short review
    print("\nTest 1: Short review")
    text1 = "Good product."
    resp1 = requests.post(f"{BASE_URL}/predict/review", json={"text": text1}, headers=headers)
    print(json.dumps(resp1.json(), indent=2))

    # Test 2: Exaggerated + Exclamation
    print("\nTest 2: Exaggerated + Exclamation")
    text2 = "This is the best product ever!!! Absolutely perfect! Buy now!!!"
    resp2 = requests.post(f"{BASE_URL}/predict/review", json={"text": text2}, headers=headers)
    print(json.dumps(resp2.json(), indent=2))

if __name__ == "__main__":
    verify()
