// frontend/src/services/auth.ts

import { api } from './api';
import { Token, User } from '@/types/user';
import { LoginRequest, RegisterRequest } from '@/types/auth'; // <-- FIXED IMPORT

/**
 * Sends a request for user login.
 * @param credentials - Login details (username, password)
 */
export const loginUser = async (credentials: LoginRequest): Promise<Token> => {
  const params = new URLSearchParams();
  params.append('username', credentials.username);
  params.append('password', credentials.password);

  const response = await api.post<Token>('/auth/login', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return response.data;
};

/**
 * Sends a request to register a new user.
 * @param userData - Registration details (username, email, password)
 */
export const registerUser = async (userData: RegisterRequest): Promise<User> => {
  const response = await api.post<User>('/auth/register', userData);
  return response.data;
};

/**
 * Gets information about the currently logged in user.
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/users/me');
  return response.data;
};

/**
 * Sends a password reset link to the given email.
 */
export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>('/auth/forgot-password', { email });
  return response.data;
};

/**
 * Resets the password using a token.
 */
export const resetPassword = async (token: string, newPassword: string): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>('/auth/reset-password', { 
    token, 
    new_password: newPassword,
    confirm_password: newPassword 
  });
  return response.data;
};