const mongoose = require('mongoose');
const User = require('../../src/models/user.model');

describe('User Model', () => {
  const userData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  };

  it('should create a new user with hashed password', async () => {
    const user = await User.create(userData);
    
    expect(user).toBeDefined();
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
    // Password should be hashed and not equal to the original
    expect(user.password).not.toBe(userData.password);
  });

  it('should not rehash password if not modified', async () => {
    // Create a user
    const user = await User.create(userData);
    const originalPassword = user.password;
    
    // Update user without changing password
    user.name = 'Updated Name';
    await user.save();
    
    // Password should remain the same
    expect(user.password).toBe(originalPassword);
  });

  it('should correctly compare passwords', async () => {
    const user = await User.create(userData);
    
    // Test with correct password
    const isMatch = await user.comparePassword(userData.password);
    expect(isMatch).toBe(true);
    
    // Test with incorrect password
    const isNotMatch = await user.comparePassword('wrongpassword');
    expect(isNotMatch).toBe(false);
  });

  it('should generate a password reset token', async () => {
    const user = await User.create(userData);
    
    const resetToken = user.generatePasswordResetToken();
    
    expect(resetToken).toBeDefined();
    expect(typeof resetToken).toBe('string');
    expect(user.resetPasswordToken).toBeDefined();
    expect(user.resetPasswordExpire).toBeDefined();
    expect(user.resetPasswordExpire).toBeInstanceOf(Date);
  });

  it('should validate email format', async () => {
    const invalidUser = new User({
      ...userData,
      email: 'invalid-email'
    });
    
    // Validate should fail due to invalid email
    await expect(invalidUser.validate()).rejects.toThrow();
  });

  it('should require name, email and password', async () => {
    const userWithoutName = new User({
      email: userData.email,
      password: userData.password
    });
    
    const userWithoutEmail = new User({
      name: userData.name,
      password: userData.password
    });
    
    const userWithoutPassword = new User({
      name: userData.name,
      email: userData.email
    });
    
    await expect(userWithoutName.validate()).rejects.toThrow();
    await expect(userWithoutEmail.validate()).rejects.toThrow();
    await expect(userWithoutPassword.validate()).rejects.toThrow();
  });
});