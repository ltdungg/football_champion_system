from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from app.schemas.user import User

class AuditLogBase(BaseModel):
    user_id: int
    action: str
    entity_type: str
    entity_id: int
    details: Optional[str] = None

class AuditLog(AuditLogBase):
    id: int
    timestamp: datetime
    user: User

    class Config:
        from_attributes = True
