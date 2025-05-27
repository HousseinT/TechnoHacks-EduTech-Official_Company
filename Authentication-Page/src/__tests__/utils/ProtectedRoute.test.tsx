
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../../utils/ProtectedRoute';


// Mock the useAuth hook
jest.mock('../../context/AuthContext', () => {
  const originalModule = jest.requireActual('../../context/AuthContext');
  return {
    ...originalModule,
    useAuth: jest.fn()
  };
});

// Test components
const ProtectedComponent = () => <div>Protected Content</div>;
const LoginComponent = () => <div>Login Page</div>;

describe('ProtectedRoute', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should render the protected component when user is authenticated', () => {
    // Mock authenticated user
    const { useAuth } = require('../../context/AuthContext');
    useAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/login" element={<LoginComponent />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <ProtectedComponent />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </MemoryRouter>
    );

    // Should render the protected component
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to login page when user is not authenticated', () => {
    // Mock unauthenticated user
    const { useAuth } = require('../../context/AuthContext');
    useAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/login" element={<LoginComponent />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <ProtectedComponent />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </MemoryRouter>
    );

    // Should redirect to login page
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should show loading state when authentication is being checked', () => {
    // Mock loading state
    const { useAuth } = require('../../context/AuthContext');
    useAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/login" element={<LoginComponent />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <ProtectedComponent />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </MemoryRouter>
    );

    // Should show loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });
});