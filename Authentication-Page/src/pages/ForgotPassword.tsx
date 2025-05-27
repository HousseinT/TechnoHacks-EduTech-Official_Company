import React, { useState } from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    setEmailError('');
    
    if (!email) {
      setEmailError('Email is required');
      return false;
    } 
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubmitted(true);
    } catch (err) {
      console.error('Password reset error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle={
        isSubmitted 
          ? 'Check your email for reset instructions'
          : 'Enter your email address and we will send you instructions to reset your password'
      }
      footerText="Remember your password?"
      footerLink={{
        text: "Back to login",
        to: "/login"
      }}
      showBackLink
    >
      {isSubmitted ? (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm shadow-sm animate-fade-in mb-4">
          <p className="font-medium mb-1">Password reset email sent!</p>
          <p>Please check your email for instructions to reset your password.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {emailError && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm shadow-sm animate-fade-in">
              {emailError}
            </div>
          )}
          
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
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
              Send reset instructions
            </Button>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;