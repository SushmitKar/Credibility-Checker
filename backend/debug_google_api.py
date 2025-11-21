import requests, os

def check_google_fact_check(text):
    api_key = os.getenv("GOOGLE_API_KEY")
    url = "https://factchecktools.googleapis.com/v1alpha1/claims:search"
    params = {
        "key": api_key,
        "query": text,
        "languageCode": "en"
    }
    
    try:
        print(f"Querying Google Fact Check with: {text}")
        response = requests.get(url, params=params)
        print(f"Google API Status: {response.status_code}")
        data = response.json()
        print(f"Google API Data: {data}")
        
        if "claims" not in data or not data["claims"]:
            print("No claims found.")
            return
            
        # Analyze the first claim found
        claim = data["claims"][0]
        claim_review = claim.get("claimReview", [])[0] if claim.get("claimReview") else {}
        publisher = claim_review.get("publisher", {}).get("name", "Unknown")
        rating = claim_review.get("textualRating", "Unknown")
        
        print(f"Publisher: {publisher}")
        print(f"Rating: {rating}")

    except Exception as e:
        print(f"Google Fact Check error: {str(e)}")

def check_mbc(text):
    url = "https://mediabiasfactcheck.p.rapidapi.com/search"
    headers = {
        "X-RapidAPI-Key": os.getenv("MBFC_API_KEY"),
        "X-RapidAPI-Host": os.getenv("MBFC_API_HOST")
    }
    query = {"query": text}

    try:
        print(f"Querying MBC with: {text}")
        response = requests.get(url, headers=headers, params=query)
        print(f"MBC API Status: {response.status_code}")
        print(f"MBC API Response: {response.text}")
        data = response.json()
        print(f"MBC API Data: {data}")

    except Exception as e:
        print(f"MBC Fact-check error: {str(e)}")

if __name__ == "__main__":
    text = "Earth 15 days of darkness"
    check_google_fact_check(text)
    check_mbc(text)
