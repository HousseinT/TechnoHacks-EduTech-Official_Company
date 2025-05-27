const express = require('express');
const { check, validationResult } = require('express-validator');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const User = require('../models/user.model');

const router = express.Router();

/**
 * @route   GET /api/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get(
  '/profile',
  authMiddleware.protect,
  authController.getCurrentUser
);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put(
  '/profile',
  [
    authMiddleware.protect,
    check('name', 'Name is required').optional().not().isEmpty(),
    check('email', 'Please include a valid email').optional().isEmail()
  ],
  async (req, res, next) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      // Get user from request (set by authMiddleware.protect)
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update fields if provided
      if (req.body.name) user.name = req.body.name;
      if (req.body.email) user.email = req.body.email;

      // Save updated user
      await user.save();

      // Return updated user data
      res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   DELETE /api/users/profile
 * @desc    Delete user account
 * @access  Private
 */
router.delete(
  '/profile',
  authMiddleware.protect,
  async (req, res, next) => {
    try {
      // Get user from request (set by authMiddleware.protect)
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Delete user
      await User.deleteOne({ _id: req.user.id });

      res.status(200).json({ message: 'User account deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;