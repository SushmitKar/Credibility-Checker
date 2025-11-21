from pydantic import BaseModel

class TextRequest(BaseModel):
    text: str

class UserCreate(BaseModel):
    username: str
    email: str | None = None
    password: str

class User(BaseModel):
    username: str

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class PredictionResponse(BaseModel):
    label: str
    confidence: float
    explanation: str | None = None
    reasons: list[str] = []
