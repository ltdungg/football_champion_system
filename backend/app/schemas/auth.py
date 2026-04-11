from typing import Optional
from pydantic import BaseModel, EmailStr, validator
from datetime import datetime


class LoginRequest(BaseModel):
    """Schema for requesting login"""
    username: str
    password: str
    
    @validator('username')
    def validate_username(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('Username is required')
        return v.strip()
    
    @validator('password')
    def validate_password(cls, v):
        if not v or len(v) == 0:
            raise ValueError('Password is required')
        return v


class LoginResponse(BaseModel):
    """Scheme for response upon successful login"""
    access_token: str
    token_type: str = "bearer"
    expires_in: int  # in seconds
    user: dict


class TokenData(BaseModel):
    """Schema for token data"""
    username: Optional[str] = None
    user_id: Optional[int] = None
    role: Optional[str] = None
    expires: Optional[datetime] = None


class Token(BaseModel):
    """Basic token scheme"""
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    """Scheme for payload JWT token"""
    sub: Optional[str] = None  # subject (user_id)
    exp: Optional[int] = None  # expiration time
    iat: Optional[int] = None  # issued at
    role: Optional[str] = None
    username: Optional[str] = None


class RefreshTokenRequest(BaseModel):
    """Schema for token refresh request"""
    refresh_token: str


class ChangePasswordRequest(BaseModel):
    """Password change scheme"""
    current_password: str
    new_password: str
    confirm_password: str
    
    @validator('new_password')
    def validate_new_password(cls, v):
        if len(v) < 6:
            raise ValueError('New password must be at least 6 characters')
        return v
    
    @validator('confirm_password')
    def validate_confirm_password(cls, v, values):
        if 'new_password' in values and v != values['new_password']:
            raise ValueError('Passwords do not match')
        return v


class ResetPasswordRequest(BaseModel):
    """Scheme for requesting a password reset"""
    email: EmailStr


class ResetPasswordConfirm(BaseModel):
    """Scheme for confirming password reset"""
    token: str
    new_password: str
    confirm_password: str
    
    @validator('new_password')
    def validate_new_password(cls, v):
        if len(v) < 6:
            raise ValueError('New password must be at least 6 characters')
        return v
    
    @validator('confirm_password')
    def validate_confirm_password(cls, v, values):
        if 'new_password' in values and v != values['new_password']:
            raise ValueError('Passwords do not match')
        return v


class UserProfile(BaseModel):
    """Schema for user profile in authentication responses"""
    id: int
    username: str
    email: EmailStr
    role: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True


class AuthResponse(BaseModel):
    """General scheme for authentication responses"""
    success: bool
    message: str
    data: Optional[dict] = None


class PermissionCheck(BaseModel):
    """Scheme for checking permissions"""
    permission: str
    resource_id: Optional[int] = None


class PermissionResponse(BaseModel):
    """Schema for permission check response"""
    has_permission: bool
    permission: str
    user_role: str