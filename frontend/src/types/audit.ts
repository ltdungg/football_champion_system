import { User } from './user';

export interface AuditLog {
  id: number;
  user_id: number;
  action: string;
  entity_type: string;
  entity_id: number;
  timestamp: string;
  details?: string;
  user: User;
}
