import React, { memo } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "../common/Link";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footerText?: string;
  footerLink?: {
    text: string;
    to: string;
  };
  showBackLink?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  footerText,
  footerLink,
  showBackLink = false,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-primary-50 via-white to-secondary-50 p-4 relative">
      {/* Background patterns - optimized */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 z-0 bg-auth-pattern opacity-30"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-secondary-400"></div>
        {/* Reduced number of animated elements */}
        <div className="fixed -top-24 -right-24 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="fixed -bottom-24 -left-24 w-96 h-96 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-soft-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>

        {showBackLink && (
          <Link
            to="/"
            className="flex items-center text-sm text-gray-500 mb-4 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Home
          </Link>
        )}

        <div className="auth-card">
          <div className="mb-6 text-center">
            <h1 className="auth-title">{title}</h1>
            <p className="auth-subtitle">{subtitle}</p>
          </div>

          {children}

          {footerText && footerLink && (
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">{footerText}</span>{" "}
              <Link to={footerLink.to} className="auth-link">
                {footerLink.text}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default memo(AuthLayout);
