import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterForm from '../../../components/auth/RegisterForm';
import { AuthProvider } from '../../../context/AuthContext';

// Mock the useAuth hook
jest.mock('../../../context/AuthContext', () => {
  const originalModule = jest.requireActual('../../../context/AuthContext');
  return {
    ...originalModule,
    useAuth: jest.fn(() => ({
      register: jest.fn(),
      isLoading: false,
      error: null,
      clearError: jest.fn()
    }))
  };
});

describe('RegisterForm', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should render register form correctly', () => {
    render(<RegisterForm />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('should validate email format', async () => {
    render(<RegisterForm />);
    
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    
    // Enter valid name and password but invalid email
    await userEvent.type(nameInput, 'Test User');
    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.type(passwordInput, 'password123');
    fireEvent.click(submitButton);
    
    // Check for validation error
    expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    render(<RegisterForm />);
    
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    
    // Submit without entering any data
    fireEvent.click(submitButton);
    
    // Check for validation errors
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it('should validate password length', async () => {
    render(<RegisterForm />);
    
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    
    // Enter valid name and email but short password
    await userEvent.type(nameInput, 'Test User');
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'pass');
    fireEvent.click(submitButton);
    
    // Check for validation error
    expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
  });

  it('should call register function with correct values on submit', async () => {
    // Get the mocked useAuth
    const { useAuth } = require('../../../context/AuthContext');
    const mockRegister = jest.fn();
    useAuth.mockReturnValue({
      register: mockRegister,
      isLoading: false,
      error: null,
      clearError: jest.fn()
    });
    
    render(<RegisterForm />);
    
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    
    // Enter valid data
    await userEvent.type(nameInput, 'Test User');
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    
    // Submit the form
    fireEvent.click(submitButton);
    
    // Check if register was called with correct values
    expect(mockRegister).toHaveBeenCalledWith('Test User', 'test@example.com', 'password123');
  });

  it('should display loading state when isLoading is true', () => {
    // Get the mocked useAuth
    const { useAuth } = require('../../../context/AuthContext');
    useAuth.mockReturnValue({
      register: jest.fn(),
      isLoading: true,
      error: null,
      clearError: jest.fn()
    });
    
    render(<RegisterForm />);
    
    // Check for loading indicator
    expect(screen.getByText(/signing up/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /signing up/i })).toBeDisabled();
  });

  it('should display error message when there is an error', () => {
    // Get the mocked useAuth
    const { useAuth } = require('../../../context/AuthContext');
    useAuth.mockReturnValue({
      register: jest.fn(),
      isLoading: false,
      error: 'User already exists',
      clearError: jest.fn()
    });
    
    render(<RegisterForm />);
    
    // Check for error message
    expect(screen.getByText(/user already exists/i)).toBeInTheDocument();
  });
});