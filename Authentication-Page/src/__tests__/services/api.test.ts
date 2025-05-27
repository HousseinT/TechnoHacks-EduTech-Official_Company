import { api } from '../../services/api';

// Mock fetch API
global.fetch = jest.fn();

describe('API Service', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should make a POST request to register endpoint with correct data', async () => {
      // Mock successful response
      const mockResponse = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        token: 'test-token'
      };

      // Setup fetch mock
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse)
      });

      // Call register function
      const result = await api.register('Test User', 'test@example.com', 'password123');

      // Check if fetch was called with correct arguments
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
          })
        }
      );

      // Check if result is correct
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error when registration fails', async () => {
      // Mock failed response
      const errorMessage = 'User already exists';
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({ message: errorMessage })
      });

      // Call register function and expect it to throw
      await expect(api.register('Test User', 'existing@example.com', 'password123'))
        .rejects
        .toThrow(errorMessage);
    });

    it('should handle network errors', async () => {
      // Mock network error
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      // Call register function and expect it to throw
      await expect(api.register('Test User', 'test@example.com', 'password123'))
        .rejects
        .toThrow('Network error');
    });
  });

  describe('login', () => {
    it('should make a POST request to login endpoint with correct data', async () => {
      // Mock successful response
      const mockResponse = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        token: 'test-token'
      };

      // Setup fetch mock
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse)
      });

      // Call login function
      const result = await api.login('test@example.com', 'password123');

      // Check if fetch was called with correct arguments
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123'
          })
        }
      );

      // Check if result is correct
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error when login fails', async () => {
      // Mock failed response
      const errorMessage = 'Invalid email or password';
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({ message: errorMessage })
      });

      // Call login function and expect it to throw
      await expect(api.login('wrong@example.com', 'wrongpassword'))
        .rejects
        .toThrow(errorMessage);
    });
  });
});