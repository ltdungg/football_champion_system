from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.auth import LoginResponse, LoginRequest
# Important: import user schemas
from app.schemas.user import UserCreate, User 
from app.services.auth import AuthService

router = APIRouter()

# --- THIS ENDPOINT WAS NOT ENOUGH ---
@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
async def register(
    user_in: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Register a new user
    """
    auth_service = AuthService(db)
    return auth_service.register(user_in)
# --------------------------------------

@router.post("/login", response_model=LoginResponse)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    auth_service = AuthService(db)
    login_data = LoginRequest(
        username=form_data.username,
        password=form_data.password
    )
    return auth_service.login(login_data)

@router.post("/logout")
async def logout():
    return {"message": "Successfully logged out"}