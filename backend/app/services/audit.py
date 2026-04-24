from typing import Optional
from sqlalchemy.orm import Session, joinedload
from app.models.audit_log import AuditLog

class AuditService:
    def __init__(self, db: Session):
        self.db = db
    
    def log_action(
        self,
        user_id: int,
        action: str,
        entity_type: str,
        entity_id: int,
        details: Optional[str] = None
    ):
        audit_log = AuditLog(
            user_id=user_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            details=details
        )
        
        self.db.add(audit_log)
        self.db.commit()
        self.db.refresh(audit_log)
        
        return audit_log
    
    def get_user_actions(self, user_id: int, limit: int = 100):
        return (
            self.db.query(AuditLog)
            .filter(AuditLog.user_id == user_id)
            .order_by(AuditLog.timestamp.desc())
            .limit(limit)
            .all()
        )
    
    def get_entity_history(self, entity_type: str, entity_id: int):
        return (
            self.db.query(AuditLog)
            .filter(
                AuditLog.entity_type == entity_type,
                AuditLog.entity_id == entity_id
            )
            .order_by(AuditLog.timestamp.desc())
            .all()
        )
    
    def get_all_logs(self, skip: int = 0, limit: int = 100):
        return (
            self.db.query(AuditLog)
            .options(joinedload(AuditLog.user))
            .order_by(AuditLog.timestamp.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )