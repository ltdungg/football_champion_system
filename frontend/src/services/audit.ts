import { api } from './api';
import { AuditLog } from '@/types/audit';

export const getAuditLogs = async (params?: { skip?: number; limit?: number }) => {
  const queryParams = new URLSearchParams();
  if (params?.skip !== undefined) queryParams.append('skip', String(params.skip));
  if (params?.limit !== undefined) queryParams.append('limit', String(params.limit));
  
  const response = await api.get<AuditLog[]>(`/audit-logs?${queryParams.toString()}`);
  return response.data;
};
