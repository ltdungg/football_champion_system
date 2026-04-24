// frontend/src/types/user.ts
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'manager';
  is_active: boolean;
  created_at?: string;
}

export interface UserCreate {
  username: string;
  email: string;
  password?: string;
  role: 'admin' | 'manager';
  is_active?: boolean;
}

export interface UserUpdate {
  username?: string;
  email?: string;
  role?: 'admin' | 'manager';
  is_active?: boolean;
}

export interface Token {
  access_token: string;
  token_type: string;
}