import sqlite3
from contextlib import asynccontextmanager
from datetime import timedelta

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy import or_
from sqlalchemy.orm import Session

from auth import verify_password, get_password_hash, create_access_token
from database import engine, get_db, Base, SessionLocal
from models import User
from predictors import load_models, predict_news, predict_review, predict_job
from schemas import Token, UserCreate, PredictionResponse, TextRequest

DEMO_USERNAME = "demo"
DEMO_EMAIL = "demo@trustlens.ai"
DEMO_PASSWORD = "demo123"


def ensure_email_column():
    """SQLite helper to add the email column for existing databases."""
    conn = sqlite3.connect("trustlens.db")
    try:
        cursor = conn.execute("PRAGMA table_info(users)")
        columns = [row[1] for row in cursor.fetchall()]
        if "email" not in columns:
            conn.execute("ALTER TABLE users ADD COLUMN email TEXT")
            conn.commit()
    finally:
        conn.close()


def ensure_default_user():
    """Create a demo account if one does not exist."""
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == DEMO_USERNAME).first()
        if not user:
            demo_user = User(
                username=DEMO_USERNAME,
                email=DEMO_EMAIL,
                hashed_password=get_password_hash(DEMO_PASSWORD),
            )
            db.add(demo_user)
            db.commit()
    finally:
        db.close()


# Create tables / migrations
Base.metadata.create_all(bind=engine)
ensure_email_column()
ensure_default_user()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load models on startup
    load_models()
    yield
    # Clean up if needed

app = FastAPI(title="TrustLens API", lifespan=lifespan)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/auth/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    filters = [User.username == user.username]
    if user.email:
        filters.append(User.email == user.email)

    existing = db.query(User).filter(or_(*filters)).first()

    if existing:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    hashed_password = get_password_hash(user.password)
    new_user = User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    access_token = create_access_token(data={"sub": new_user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/")
def read_root():
    return {"message": "TrustLens API is running"}

@app.post("/predict/news", response_model=PredictionResponse)
def api_predict_news(request: TextRequest, token: str = Depends(oauth2_scheme)):
    result = predict_news(request.text)
    return PredictionResponse(label=result["label"], confidence=result["confidence"], reasons=result["reasons"])

@app.post("/predict/review", response_model=PredictionResponse)
def api_predict_review(request: TextRequest, token: str = Depends(oauth2_scheme)):
    result = predict_review(request.text)
    return PredictionResponse(label=result["label"], confidence=result["confidence"], reasons=result["reasons"])

@app.post("/predict/job", response_model=PredictionResponse)
def api_predict_job(request: TextRequest, token: str = Depends(oauth2_scheme)):
    result = predict_job(request.text)
    return PredictionResponse(label=result["label"], confidence=result["confidence"], reasons=result["reasons"])
