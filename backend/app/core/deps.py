from typing import Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_token
from app.repositories.user import UserRepository
from app.models.user import User

# We use OAuth2PasswordBearer, since this is the standard for JWT With Bearer tokens
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

def get_current_user_optional(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme_optional)
) -> User | None:
    """Dependency to get current user optionally if token is provided."""
    if not token:
        return None
    payload = verify_token(token)
    if not payload:
        return None
    user_id_str = payload.get("sub")
    if not user_id_str:
        return None
    try:
        user_id = int(user_id_str)
        user_repo = UserRepository(db)
        user = user_repo.get(user_id)
        if user and user.is_active:
            return user
        return None
    except Exception:
        return None

def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    """
    Dependency to get current user from JWT token.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = verify_token(token)
    
    if payload is None:
        raise credentials_exception
    
    # We extract ID user from field "sub"
    user_id_str: str | None = payload.get("sub")
    if user_id_str is None:
        raise credentials_exception
    
    try:
        user_id = int(user_id_str)
    except (ValueError, TypeError):
        raise credentials_exception

    user_repo = UserRepository(db)
    user = user_repo.get(user_id) # We are looking for a user by ID
    
    if user is None:
        raise credentials_exception
    
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Inactive user")
        
    return user

def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    """
    Dependency that checks if the current user is an administrator.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user does not have enough privileges. Administrator role required."
        )
    return current_user

def get_current_manager_or_admin(current_user: User = Depends(get_current_user)) -> User:
    """
    Dependency that checks if the current user is a manager or administrator.
    """
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user does not have enough privileges. Manager or Administrator role required."
        )
    return current_user