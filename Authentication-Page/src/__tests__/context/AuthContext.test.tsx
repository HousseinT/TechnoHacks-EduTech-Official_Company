import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../../context/AuthContext';

// Mock the API service
jest.mock('../../services/api', () => ({
  api: {
    register: jest.fn().mockImplementation((name, email, password) => {
      if (email === 'existing@example.com') {
        return Promise.reject(new Error('User already exists'));
      }
      return Promise.resolve({ id: '123', name, email });
    }),
    login: jest.fn().mockImplementation((email, password) => {
      if (email === 'test@example.com' && password === 'password123') {
        return Promise.resolve({ id: '123', name: 'Test User', email });
      }
      return Promise.reject(new Error('Invalid email or password'));
    })
  }
}));

// Test component that uses the auth context
const TestComponent = () => {
  const { user, isAuthenticated, isLoading, error, login, register, logout } = useAuth();
  
  return (
    <div>
      <div data-testid="loading">{isLoading ? 'Loading...' : 'Not loading'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'Authenticated' : 'Not authenticated'}</div>
      <div data-testid="user">{user ? JSON.stringify(user) : 'No user'}</div>
      <div data-testid="error">{error || 'No error'}</div>
      
      <button 
        data-testid="login-button" 
        onClick={() => login('test@example.com', 'password123')}
      >
        Login
      </button>
      
      <button 
        data-testid="register-button" 
        onClick={() => register('Test User', 'new@example.com', 'password123')}
      >
        Register
      </button>
      
      <button 
        data-testid="logout-button" 
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
  });
  
  it('should initialize with no user and not authenticated', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('authenticated')).toHaveTextContent('Not authenticated');
    expect(screen.getByTestId('user')).toHaveTextContent('No user');
    expect(screen.getByTestId('error')).toHaveTextContent('No error');
  });
  
  it('should load user from localStorage on mount', async () => {
    // Set user in localStorage
    const testUser = { id: '1', name: 'Test User', email: 'test@example.com' };
    window.localStorage.setItem('user', JSON.stringify(testUser));
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Wait for the useEffect to run
    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(testUser));
    });
  });
  
  it('should handle login successfully', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Click login button
    fireEvent.click(screen.getByTestId('login-button'));
    
    // Should show loading state
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading...');
    
    // Wait for login to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not loading');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user')).toContainHTML('Test User');
      expect(screen.getByTestId('error')).toHaveTextContent('No error');
    });
    
    // Check localStorage
    const storedUser = JSON.parse(window.localStorage.getItem('user') || '{}');
    expect(storedUser.name).toBe('Test User');
  });
  
  it('should handle login failure', async () => {
    // Mock the login function to reject
    const mockApi = require('../../services/api').api;
    mockApi.login.mockRejectedValueOnce(new Error('Invalid credentials'));
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Click login button
    fireEvent.click(screen.getByTestId('login-button'));
    
    // Wait for login to fail
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not loading');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Not authenticated');
      expect(screen.getByTestId('error')).toHaveTextContent('Invalid credentials');
    });
  });
  
  it('should handle registration successfully', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Click register button
    fireEvent.click(screen.getByTestId('register-button'));
    
    // Wait for registration to complete
    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user')).toContainHTML('new@example.com');
    });
    
    // Check localStorage
    const storedUser = JSON.parse(window.localStorage.getItem('user') || '{}');
    expect(storedUser.email).toBe('new@example.com');
  });
  
  it('should handle logout', async () => {
    // Set user in localStorage
    const testUser = { id: '1', name: 'Test User', email: 'test@example.com' };
    window.localStorage.setItem('user', JSON.stringify(testUser));
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Wait for the user to be loaded
    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
    });
    
    // Click logout button
    fireEvent.click(screen.getByTestId('logout-button'));
    
    // Check that user is logged out
    expect(screen.getByTestId('authenticated')).toHaveTextContent('Not authenticated');
    expect(screen.getByTestId('user')).toHaveTextContent('No user');
    
    // Check localStorage
    expect(window.localStorage.getItem('user')).toBeNull();
  });
});