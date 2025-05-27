import React from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import LoginForm from '../components/auth/LoginForm';

const Login: React.FC = () => {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your email and password to log in"
      footerText="Don't have an account?"
      footerLink={{
        text: "Sign up",
        to: "/register"
      }}
      showBackLink
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;