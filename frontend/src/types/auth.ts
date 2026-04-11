// frontend/src/types/auth.ts

/**
 * Interface for data sent upon login.
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Interface for data sent during registration.
 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}