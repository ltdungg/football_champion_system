from typing import Optional, Dict, Any
from datetime import datetime, timedelta
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from app.schemas.user import UserCreate

from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    verify_token
)
from app.core.config import settings
from app.repositories.user import UserRepository
from app.models.user import User
from app.models.audit_log import AuditLog
from app.schemas.auth import (
    LoginRequest,
    LoginResponse,
    TokenPayload,
    ChangePasswordRequest,
    UserProfile
)


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repository = UserRepository(db)

    def authenticate_user(self, username: str, password: str) -> Optional[User]:
        """User authentication using login and password"""
        user = self.user_repository.get_by_username(username)
        if not user:
            return None
        if not user.is_active:
            return None
        if not verify_password(password, user.password_hash):
            return None
        return user

    def register(self, user_in: UserCreate) -> User:
        """New user registration"""
        # 1. Checking to see if it's busy username
        if self.user_repository.get_by_username(user_in.username):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered"
            )
        
        # 2. Checking email (if the repository has such a method, otherwise you can skip or add try/except)
        # We assume that in UserRepository There is get_by_email, if not, comment out the next 4 lines
        if hasattr(self.user_repository, 'get_by_email') and self.user_repository.get_by_email(user_in.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # 3. Hashing the password
        hashed_password = get_password_hash(user_in.password)

        # 4. We prepare the data for creation (exclude the blank password, add a hash)
        user_data = user_in.dict(exclude={"password"})
        user_data["password_hash"] = hashed_password
        
        # 5. Create a user through the repository
        # UserRepository must have a method create. If it doesn't exist, it is inherited from BaseRepository.
        user = self.user_repository.create(user_data)

        # 6. Logging the action
        self._log_action(
            user_id=user.id,
            action="REGISTER",
            entity_type="USER",
            entity_id=user.id,
            details=f"New user registered: {user.username}"
        )

        return user

    def login(self, login_data: LoginRequest) -> LoginResponse:
        """Login"""
        print("--- RUNNING LATEST VERSION OF LOGIN FUNCTION ---")

        user = self.authenticate_user(login_data.username, login_data.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Creating a token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        token_data = {
            "sub": str(user.id),
            "username": user.username,
            "role": user.role,
            "iat": datetime.utcnow(),
        }
        access_token = create_access_token(
            data=token_data,
            expires_delta=access_token_expires
        )

        # Login logging
        self._log_action(
            user_id=user.id,
            action="LOGIN",
            entity_type="USER",
            entity_id=user.id,
            details=f"User {user.username} logged in"
        )

        # --- FIX: Create an object UserProfile, and then convert it to dict,
        # since the scheme LoginResponse awaits dict. ---
        user_profile = UserProfile(
            id=user.id,
            username=user.username,
            email=user.email,
            role=user.role,
            is_active=user.is_active,
            created_at=user.created_at,
            updated_at=user.updated_at
        )

        return LoginResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60, # <--- MAKE SURE THIS LINE IS PRESENT
            user=user_profile.model_dump()
        )

    def get_current_user(self, token: str) -> User:
        """Getting the current user by token"""
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

        try:
            payload = verify_token(token)
            if payload is None:
                raise credentials_exception

            user_id: str = payload.get("sub")
            if user_id is None:
                raise credentials_exception

            # We use a schema to validate the contents of the token
            token_data = TokenPayload(**payload)

        except (JWTError, Exception): # We catch and JWTError, and validation errors Pydantic
            raise credentials_exception

        user = self.user_repository.get(int(token_data.sub))
        if user is None:
            raise credentials_exception
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is disabled"
            )
        return user

    def change_password(self, user: User, password_data: ChangePasswordRequest) -> Dict[str, str]:
        """Changing user password"""
        if not verify_password(password_data.current_password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect"
            )

        new_password_hash = get_password_hash(password_data.new_password)
        user.password_hash = new_password_hash
        user.updated_at = datetime.utcnow()

        self.db.commit()
        self.db.refresh(user)

        self._log_action(
            user_id=user.id,
            action="UPDATE",
            entity_type="USER",
            entity_id=user.id,
            details=f"User {user.username} changed password"
        )

        return {"message": "Password changed successfully"}

    def check_permission(self, user: User, permission: str) -> bool:
        """Checking user permissions"""
        permission_mapping = {
            "admin": [
                "manage_teams", "manage_players", "manage_stadiums",
                "manage_matches", "manage_tickets", "view_reports",
                "manage_users", "view_audit_logs"
            ],
            "manager": [
                "manage_teams", "manage_players", "manage_stadiums",
                "manage_matches", "manage_tickets", "view_reports"
            ]
        }

        user_permissions = permission_mapping.get(user.role, [])
        return permission in user_permissions

    def require_permission(self, user: User, permission: str) -> None:
        """Permission requirement (raises an exception if not present))"""
        if not self.check_permission(user, permission):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions. Required: {permission}"
            )

    def get_user_profile(self, user: User) -> UserProfile:
        """Getting a user profile"""
        return UserProfile.from_orm(user) # We use from_orm to transform the model SQLAlchemy

    def logout(self, user: User) -> Dict[str, str]:
        """Logout"""
        self._log_action(
            user_id=user.id,
            action="LOGOUT",
            entity_type="USER",
            entity_id=user.id,
            details=f"User {user.username} logged out"
        )

        return {"message": "Successfully logged out"}

    def refresh_token(self, user: User) -> LoginResponse:
        """Token update"""
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        token_data = {
            "sub": str(user.id),
            "username": user.username,
            "role": user.role,
            "iat": datetime.utcnow(),
        }
        access_token = create_access_token(
            data=token_data,
            expires_delta=access_token_expires
        )

        user_profile = UserProfile.from_orm(user)

        return LoginResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60, # <--- AND THIS LINE TOO
            user=user_profile.model_dump()
        )

    def _log_action(self, user_id: int, action: str, entity_type: str,
                   entity_id: int, details: str = None) -> None:
        """Internal method for logging actions"""
        audit_log = AuditLog(
            user_id=user_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            details=details,
            timestamp=datetime.utcnow()
        )
        self.db.add(audit_log)
        self.db.commit()