import { api } from './api';
import { User, UserCreate, UserUpdate } from '@/types/user';

export const getUsers = async (params?: { skip?: number; limit?: number }) => {
  const queryParams = new URLSearchParams();
  if (params?.skip !== undefined) queryParams.append('skip', String(params.skip));
  if (params?.limit !== undefined) queryParams.append('limit', String(params.limit));
  
  const response = await api.get<User[]>(`/users?${queryParams.toString()}`);
  return response.data;
};

export const getUser = async (id: number) => {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
};

export const createUser = async (data: UserCreate) => {
  const response = await api.post<User>('/users', data);
  return response.data;
};

export const updateUser = async (id: number, data: UserUpdate) => {
  const response = await api.put<User>(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: number) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const activateUser = async (id: number) => {
  const response = await api.post<User>(`/users/${id}/activate`);
  return response.data;
};

export const deactivateUser = async (id: number) => {
  const response = await api.post<User>(`/users/${id}/deactivate`);
  return response.data;
};

export const changeUserPassword = async (id: number, new_password: string) => {
  const response = await api.post(`/users/${id}/change-password`, { new_password });
  return response.data;
};
