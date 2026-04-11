from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from app.core.config import settings
from app.core.database import engine
from app.models import Base
from app.routers import teams, players, stadiums, matches, tickets, auth, reports, users

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="API for Football Championship Management System",
    openapi_url="/openapi.json" # We remove the prefix from here, since it will be global
)

# Set up CORS
# Make sure that in .env or config.py you have a variable BACKEND_CORS_ORIGINS,
# containing the address of your frontend, for example: ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS if settings.BACKEND_CORS_ORIGINS else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- CHANGE: Add a common prefix API_V1_STR ---
api_prefix = settings.API_V1_STR # For example, "/api"

app.include_router(auth.router, prefix=f"{api_prefix}/auth", tags=["auth"])
app.include_router(teams.router, prefix=f"{api_prefix}/teams", tags=["teams"])
app.include_router(players.router, prefix=f"{api_prefix}/players", tags=["players"])
app.include_router(stadiums.router, prefix=f"{api_prefix}/stadiums", tags=["stadiums"])
app.include_router(matches.router, prefix=f"{api_prefix}/matches", tags=["matches"])
app.include_router(tickets.router, prefix=f"{api_prefix}/tickets", tags=["tickets"])
app.include_router(reports.router, prefix=f"{api_prefix}/reports", tags=["reports"])
app.include_router(users.router, prefix=f"{api_prefix}/users", tags=["users"])

@app.get("/")
async def root():
    # Redirect to documentation Swagger UI
    return RedirectResponse(url="/docs")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}