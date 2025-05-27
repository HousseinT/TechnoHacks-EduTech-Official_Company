import React from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import RegisterForm from '../components/auth/RegisterForm';

const Register: React.FC = () => {
  return (
    <AuthLayout
      title="Create an account"
      subtitle="Get started with your free account"
      footerText="Already have an account?"
      footerLink={{
        text: "Sign in",
        to: "/login"
      }}
      showBackLink
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default Register;