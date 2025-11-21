# TrustLens Backend Architecture

This document provides a detailed breakdown of the backend systems used in the TrustLens project and a map of how the files connect.

## 1. System Overview

The backend is built using **FastAPI**, a modern, high-performance web framework for building APIs with Python. It is designed to be modular, separating concerns into API routing, authentication, database management, and core prediction logic.

### A. API Layer (`main.py`)
*   **Role**: The entry point of the application.
*   **Functionality**:
    *   Initializes the `FastAPI` app.
    *   Configures **CORS** (Cross-Origin Resource Sharing) to allow the frontend to communicate with the backend.
    *   Defines API endpoints for:
        *   **Authentication**: `/auth/register`, `/auth/login`.
        *   **Predictions**: `/predict/news`, `/predict/review`, `/predict/job`.
    *   Manages the **Lifespan** of the application (loading ML models on startup).
    *   Handles dependency injection for Database sessions and User Authentication.

### B. Authentication System (`auth.py`)
*   **Role**: Manages user security and access control.
*   **Functionality**:
    *   **Password Hashing**: Uses `bcrypt` (via `passlib`) to securely hash passwords before storing them in the database.
    *   **JWT Tokens**: Generates JSON Web Tokens (JWT) for authenticated sessions.
    *   **Verification**: Validates passwords during login and verifies JWT tokens for protected routes.

### C. Database Layer (`database.py`, `models.py`, `schemas.py`)
*   **Role**: Handles data persistence and validation.
*   **Components**:
    *   **`database.py`**: Sets up the **SQLite** database connection and creates the `SQLAlchemy` engine and session factory.
    *   **`models.py`**: Defines the database schema using SQLAlchemy ORM. Currently contains the `User` model (id, username, email, hashed_password).
    *   **`schemas.py`**: Defines **Pydantic** models for data validation. These ensure that requests (e.g., `UserCreate`, `TextRequest`) and responses (e.g., `PredictionResponse`) follow a strict format.

### D. Prediction Engine (`predictors.py`)
*   **Role**: The "brain" of the application. It combines Machine Learning models with rule-based logic and external APIs.
*   **Functionality**:
    *   **Model Loading**: Loads pre-trained models (RoBERTa for News/Jobs, Random Forest for Reviews) into memory on startup.
    *   **Hybrid Logic**:
        *   **News**: Combines RoBERTa probability + Keyword Rules + MediaBiasFactCheck API + Google Fact Check API.
        *   **Reviews**: Combines TF-IDF Vectorization + Random Forest + Heuristic Rules (e.g., excessive caps, repetition).
        *   **Jobs**: Combines RoBERTa probability + Scam Keyword Rules.
    *   **Scoring**: Aggregates scores from all sources to produce a final `confidence` score and a list of `reasons`.

---

## 2. File Connection Map

The following diagram shows how the files in the backend interact with each other.


[Entry Point]
main.py
  |
  |--> [Authentication]
  |      auth.py
  |
  |--> [Core Logic]
  |      predictors.py
  |        |--> [Loads Models]
  |               /models directory
  |
  |--> [Data Layer]
  |      database.py (DB Connection)
  |      models.py (DB Tables)
  |      schemas.py (Validation)
  |        |
  |        |--> [Storage]
  |               trustlens.db (SQLite File)


### Detailed Connection Flow

1.  **Request Flow**:
    *   A request hits `main.py`.
    *   `main.py` uses `schemas.py` to validate the request body.
    *   If the route requires login, `main.py` calls `auth.py` to verify the token.

2.  **Prediction Flow**:
    *   For prediction routes, `main.py` calls functions in `predictors.py`.
    *   `predictors.py` uses the loaded **ML Models** and internal logic to return a result.

3.  **Database Flow**:
    *   `main.py` gets a DB session from `database.py`.
    *   It uses `models.py` to query or save data (e.g., creating a user).
    *   The data is persisted in `trustlens.db`.
