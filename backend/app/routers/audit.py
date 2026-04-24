from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_admin
from app.models.user import User
from app.schemas.audit import AuditLog as AuditLogSchema
from app.services.audit import AuditService

router = APIRouter(
    tags=["audit-logs"],
    responses={404: {"description": "Not found"}},
)

@router.get("", response_model=List[AuditLogSchema])
def get_audit_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    Get all audit logs (administrators only).
    """
    audit_service = AuditService(db)
    logs = audit_service.get_all_logs(skip=skip, limit=limit)
    return logs
