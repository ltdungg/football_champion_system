# Backend Architecture Analysis

The backend of the Football Championship System is built using **FastAPI**, a modern, fast (high-performance), web framework for building APIs with Python 3.11+, based on OpenAPI and Python type hints.

## Technology Stack

*   **Framework:** FastAPI
*   **Language:** Python 3.11
*   **Server:** Uvicorn (ASGI web server)
*   **Database:** PostgreSQL 15
*   **ORM:** SQLAlchemy 2.0
*   **Migrations:** Alembic (configured via requirements, though currently using `Base.metadata.create_all` for init)
*   **Data Validation:** Pydantic V2
*   **Authentication:** JWT (JSON Web Tokens) using `python-jose` and `passlib` for password hashing.

## Directory Structure & Architectural Pattern

The application follows the **Repository/Service pattern**, drastically separating routing logic from business logic and database interactions.

```
backend/
├── app/
│   ├── core/         # Core settings, database connection, dependency injection, and security configurations.
│   ├── models/       # SQLAlchemy ORM definitions mapping directly to PostgreSQL tables.
│   ├── schemas/      # Pydantic models mapping incoming payloads and outgoing responses.
│   ├── repositories/ # Classes explicitly managing database CRUD operations.
│   ├── services/     # Business logic classes coordinating between Repositories and external rules.
│   ├── routers/      # FastAPI API endpoint groupings.
│   ├── utils/        # Generic helper functions.
│   └── main.py       # FastAPI application initialisation and router aggregation.
├── .env              # Environment overrides
├── requirements.txt  # Python pip dependencies
└── Dockerfile        # Container build instructions
```

## Data Models (ORM)

The system is centered around the following interconnected entities:
1.  **Users:** Administrators and Managers handling distinct authorizations.
2.  **Stadiums:** Arenas characterized by their capacity and location.
3.  **Teams & Players:** Core football entities interconnected by foreign keys.
4.  **Matches & Tickets:** Game schedules and pricing structures dictating championship flow.
5.  **Audit Logs:** Internal security ledger documenting critical manager/admin actions (`CREATE`, `UPDATE`, `DELETE`).

## Security & Authentication

The backend secures endpoints utilizing **OAuth2** with Bearer tokens (JWT). 
-   **Registration (`/api/auth/register`)**: Verifies data schema, creates a bcrypt password hash, and stores the user.
-   **Login (`/api/auth/login`)**: Utilizing `OAuth2PasswordRequestForm`, it validates username/password pairings and issues an access token valid for 30 minutes (configurable via `$ACCESS_TOKEN_EXPIRE_MINUTES`).
-   **Dependancy Guards (`get_current_user`)**: Secures routes by extracting and validating the JWT headers, throwing `401 Unauthorized` unconditionally if corrupted or expired.

## API Documentation Integration

Because the backend operates on FastAPI, it inherently implements **OpenAPI** standards. Swagger UI and ReDoc are auto-generated.
*By running the docker container and mapping port 8000, these documentations can be tested in real-time via:*
-   *Swagger UI:* `http://localhost:8000/docs`
-   *ReDoc:* `http://localhost:8000/redoc`
