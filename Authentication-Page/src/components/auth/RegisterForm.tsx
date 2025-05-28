import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import Input from '../common/Input';
import PasswordInput from './PasswordInput';

const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Form errors
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const { register, isLoading, error, clearError } = useAuth();

  const validateForm = () => {
    let valid = true;
    
    // Reset errors
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    clearError();
    
    // Name validation
    if (!name.trim()) {
      setNameError('Name is required');
      valid = false;
    }
    
    // Email validation
    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    }
    
    // Password validation
    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      valid = false;
    }
    
    // Confirm password validation
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      valid = false;
    }
    
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await register(name, email, password);
      // Navigate to login page after successful registration
      window.history.pushState({}, '', '/login');
      window.dispatchEvent(new CustomEvent('pathChanged'));
    } catch (err) {
      // Error is handled in the auth context
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm shadow-sm animate-fade-in">
          {error}
        </div>
      )}
      
      <Input
        label="Full name"
        type="text"
        placeholder="John Doe"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={nameError}
        required
      />
      
      <Input
        label="Email address"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={emailError}
        required
      />
      
      <PasswordInput
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={passwordError}
        required
      />
      
      <PasswordInput
        label="Confirm password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={confirmPasswordError}
        required
      />
      
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          fullWidth
          className="mt-2 py-3.5 font-semibold"
        >
          Create account
        </Button>
      </div>
      
      <div className="pt-5">
        <div className="relative flex items-center">
          <div className="border-t border-gray-300 flex-grow"></div>
          <div className="px-4 text-sm text-gray-500 font-medium">or sign up with</div>
          <div className="border-t border-gray-300 flex-grow"></div>
        </div>
        
        <div className="flex justify-center mt-5">
          <button
            type="button"
            className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 transition-all duration-200 hover:shadow-md w-64 mx-auto"
            onClick={() => alert('Google login coming soon!')}
          >
            <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
              <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.73 18.23 13.48 18.63 12 18.63C9.19 18.63 6.8 16.73 5.95 14.1H2.27V16.94C4.08 20.47 7.76 23 12 23Z" fill="#34A853"/>
              <path d="M5.95 14.1C5.75 13.47 5.63 12.79 5.63 12.09C5.63 11.39 5.75 10.71 5.95 10.08V7.24H2.27C1.46 8.68 1 10.35 1 12.09C1 13.83 1.46 15.5 2.27 16.94L5.95 14.1Z" fill="#FBBC05"/>
              <path d="M12 5.55C13.57 5.55 14.97 6.08 16.09 7.15L19.28 3.96C17.46 2.26 14.97 1.27 12 1.27C7.76 1.27 4.08 3.8 2.27 7.33L5.95 10.17C6.8 7.54 9.19 5.55 12 5.55Z" fill="#EA4335"/>
            </svg>
             Google
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;