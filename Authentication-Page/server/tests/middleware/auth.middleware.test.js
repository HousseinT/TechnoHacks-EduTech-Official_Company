const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { protect, restrictTo } = require('../../src/middleware/auth.middleware');
const User = require('../../src/models/user.model');

// Mock the User model
jest.mock('../../src/models/user.model');

describe('Auth Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Setup request, response, and next function mocks
    req = {
      headers: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    next = jest.fn();
  });

  describe('protect middleware', () => {
    it('should return 401 if no token is provided', async () => {
      await protect(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not authorized to access this route. Please log in.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', async () => {
      req.headers.authorization = 'Bearer invalidtoken';
      
      // Mock jwt.verify to throw an error
      jest.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });
      
      await protect(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid or expired token. Please log in again.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if user no longer exists', async () => {
      const userId = new mongoose.Types.ObjectId();
      req.headers.authorization = 'Bearer validtoken';
      
      // Mock jwt.verify to return a decoded token
      jest.spyOn(jwt, 'verify').mockReturnValue({ id: userId });
      
      // Mock User.findById to return null (user not found)
      User.findById.mockResolvedValue(null);
      
      await protect(req, res, next);
      
      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'The user belonging to this token no longer exists'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next() if token is valid and user exists', async () => {
      const userId = new mongoose.Types.ObjectId();
      const user = { _id: userId, name: 'Test User' };
      req.headers.authorization = 'Bearer validtoken';
      
      // Mock jwt.verify to return a decoded token
      jest.spyOn(jwt, 'verify').mockReturnValue({ id: userId });
      
      // Mock User.findById to return a user
      User.findById.mockResolvedValue(user);
      
      await protect(req, res, next);
      
      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(req.user).toEqual(user);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('restrictTo middleware', () => {
    beforeEach(() => {
      // Setup user in request
      req.user = { role: 'user' };
    });

    it('should return 403 if user role is not allowed', () => {
      const middleware = restrictTo('admin');
      middleware(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'You do not have permission to perform this action'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next() if user role is allowed', () => {
      const middleware = restrictTo('user', 'admin');
      middleware(req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});