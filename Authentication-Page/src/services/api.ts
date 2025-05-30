
/**
 * API configuration
 */
const API_URL = 'http://localhost:5000/api'; // Backend server URL

/**
 * Example of what a real API service might look like
 */
export const api = {

  /**
   * Register a new user
   */
  register: async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Login a user
   */
  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Google authentication
   */
  googleAuth: async (credential: string) => {
    try {
      // In a real application, you would send the credential to your backend
      // For this demo, we'll simulate a successful response
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Parse the JWT token to extract user information
      // Note: In a real app, token verification should happen on the server
      const tokenParts = credential.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid token format');
      }
      
      // Decode the payload (second part of the JWT)
      const payload = JSON.parse(atob(tokenParts[1].replace(/-/g, '+').replace(/_/g, '/')));
      
      // Return simulated successful response
      return {
        user: {
          id: payload.sub || Math.random().toString(36).substr(2, 9),
          name: payload.name || 'Google User',
          email: payload.email || 'user@example.com',
        },
        token: credential,
      };
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Request password reset
   */
  requestPasswordReset: async (email: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Password reset request failed');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },
};

// Note: In the demo app, we're using mock implementations in the AuthContext
// This file would be used in a real application with an actual backend API