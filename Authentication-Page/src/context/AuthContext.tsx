import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

// Define types
type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  register: async () => {},
  login: async () => {},
  loginWithGoogle: async () => {},
  logout: () => {},
  clearError: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing user session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Register function that connects to the API service
  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Call the API service to register the user
      const response = await api.register(name, email, password);
      
      // Create a new user from the response
      const newUser = {
        id: response.user?.id || response.id || Math.random().toString(36).substr(2, 9),
        name: response.user?.name || name,
        email: response.user?.email || email,
      };
      
      // Save token if provided
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      // Save to local storage
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Login function that connects to the API service
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Call the API service to login the user
      const response = await api.login(email, password);
      
      // Create user from the response
      const loggedInUser = {
        id: response.user?.id || response.id || Math.random().toString(36).substr(2, 9),
        name: response.user?.name || 'User',
        email: response.user?.email || email,
      };
      
      // Save token if provided
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      // Save to local storage
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Google login function
  const loginWithGoogle = async (credential: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Call the API service to authenticate with Google
      const response = await api.googleAuth(credential);
      
      // Create user from the response
      const googleUser = {
        id: response.user?.id || Math.random().toString(36).substr(2, 9),
        name: response.user?.name || 'Google User',
        email: response.user?.email || 'user@example.com',
      };
      
      // Save token if provided
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      // Save to local storage
      localStorage.setItem('user', JSON.stringify(googleUser));
      setUser(googleUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google authentication failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        register,
        login,
        loginWithGoogle,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};