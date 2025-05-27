import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../../../components/auth/LoginForm';
import { AuthProvider } from '../../../context/AuthContext';

// Mock the useAuth hook
jest.mock('../../../context/AuthContext', () => {
  const originalModule = jest.requireActual('../../../context/AuthContext');
  return {
    ...originalModule,
    useAuth: jest.fn(() => ({
      login: jest.fn(),
      isLoading: false,
      error: null,
      clearError: jest.fn()
    }))
  };
});

describe('LoginForm', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should render login form correctly', () => {
    render(<LoginForm />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should validate email format', async () => {
    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    // Enter invalid email
    await userEvent.type(emailInput, 'invalid-email');
    fireEvent.click(submitButton);
    
    // Check for validation error
    expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    render(<LoginForm />);
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    // Submit without entering any data
    fireEvent.click(submitButton);
    
    // Check for validation errors
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it('should call login function with correct values on submit', async () => {
    // Get the mocked useAuth
    const { useAuth } = require('../../../context/AuthContext');
    const mockLogin = jest.fn();
    useAuth.mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
      clearError: jest.fn()
    });
    
    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    // Enter valid data
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    
    // Submit the form
    fireEvent.click(submitButton);
    
    // Check if login was called with correct values
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('should display loading state when isLoading is true', () => {
    // Get the mocked useAuth
    const { useAuth } = require('../../../context/AuthContext');
    useAuth.mockReturnValue({
      login: jest.fn(),
      isLoading: true,
      error: null,
      clearError: jest.fn()
    });
    
    render(<LoginForm />);
    
    // Check for loading indicator
    expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
  });

  it('should display error message when there is an error', () => {
    // Get the mocked useAuth
    const { useAuth } = require('../../../context/AuthContext');
    useAuth.mockReturnValue({
      login: jest.fn(),
      isLoading: false,
      error: 'Invalid email or password',
      clearError: jest.fn()
    });
    
    render(<LoginForm />);
    
    // Check for error message
    expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
  });
});