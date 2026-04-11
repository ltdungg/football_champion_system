// frontend/src/context/AuthContext.tsx

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { loginUser, registerUser, getCurrentUser } from '@/services/auth';
import { LoginRequest, RegisterRequest } from '@/types/auth';
import { User } from '@/types/user';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
}

// The context should not be exported directly to avoid accidental use without a hook
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  // The output function has been moved to the top so that it can be used in useEffect
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          console.error("Failed to fetch user, token might be invalid.", error);
          logout();
        }
      }
      setIsLoading(false);
    };
    loadUser();
  }, [token]);

  const login = async (credentials: LoginRequest) => {
    const data = await loginUser(credentials);
    localStorage.setItem('token', data.access_token);
    setToken(data.access_token);
  };

  const register = async (userData: RegisterRequest) => {
    await registerUser(userData);
    await login({ username: userData.username, password: userData.password });
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to access the authentication context.
 * @returns {AuthContextType} Context with user data and methods.
 * @throws {Error} If used outside AuthProvider.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};