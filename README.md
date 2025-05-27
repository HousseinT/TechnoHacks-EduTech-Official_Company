# Authentication Page | Secure User Authentication System with React & Node.js

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Overview

Authentication Page is a modern, secure, and SEO-friendly user authentication system designed for web applications. Built with a robust tech stack including React 18, TypeScript, and Node.js, it offers comprehensive user management features such as secure registration, JWT-based login, password recovery, and protected routes. A key highlight is its seamless Google OAuth integration, providing a convenient one-click sign-in experience. The project boasts a clean, responsive UI with a beautiful gradient background and a modern design aesthetic, ensuring an excellent user experience across all devices.

## Key Features

- **Secure User Registration** - Email validation and strong password requirements enhance user data security
- **JWT Authentication** - Robust token-based authentication for secure user sessions and access control
- **Google OAuth Integration** - Streamlined one-click sign-in using Google accounts for improved user convenience
- **Password Recovery System** - Efficient forgot password functionality with email-based reset links
- **Protected Routes** - Secure routing to restrict access to authenticated users only
- **Responsive Design** - Mobile-first approach with a clean, modern UI for optimal experience on any device
- **Comprehensive Form Validation** - Client-side validation for all forms ensuring data integrity
- **Advanced Error Handling** - Clear user feedback mechanisms improving application reliability
- **Extensive Testing Coverage** - Jest and React Testing Library implementation for code quality

## Project Structure

```
├── .gitignore                # Git ignore file
├── README.md                 # Project documentation
├── config.json               # Configuration settings
├── coverage/                 # Test coverage reports
├── eslint.config.js          # ESLint configuration
├── index.html                # Main HTML entry point
├── jest.config.js            # Jest testing configuration
├── package.json              # Project dependencies and scripts
├── postcss.config.js         # PostCSS configuration
├── server/                   # Backend code
│   ├── .env.example          # Example environment variables
│   ├── jest.config.js        # Backend test configuration
│   ├── package.json          # Backend dependencies
│   ├── src/                  # Backend source code
│   └── tests/                # Backend tests
├── src/                      # Frontend source code
│   ├── App.tsx               # Main React component
│   ├── __tests__/            # Frontend tests
│   ├── assets/               # Static assets (images, fonts)
│   ├── components/           # Reusable UI components
│   ├── context/              # React context providers
│   ├── index.css             # Global CSS
│   ├── main.tsx              # React entry point
│   ├── pages/                # Page components
│   ├── services/             # API services
│   ├── utils/                # Utility functions
│   └── vite-env.d.ts         # Vite type declarations
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite bundler configuration
```

## Tech Stack

### Frontend Technologies

- **React 18** - Powerful JavaScript library for building dynamic user interfaces
- **TypeScript** - Static typing for enhanced code quality and maintainability
- **React Router v7** - Declarative routing within the single-page application
- **TailwindCSS** - Utility-first CSS framework for rapid UI development
- **Lucide React** - Beautiful and customizable open-source icons
- **Google OAuth Integration** - Seamless authentication with Google accounts
- **Jest & React Testing Library** - Comprehensive tools for frontend testing
- **Vite** - Next-generation frontend tooling for fast development

### Backend Technologies

- **Node.js with Express** - Fast, minimalist web framework
- **MongoDB with Mongoose** - NoSQL database with elegant object modeling
- **JWT Authentication** - Secure and stateless authentication
- **bcrypt** - Library for secure password hashing
- **Express Validator** - Middleware for request data validation
- **Nodemailer** - Module for email functionality
- **Jest** - Testing framework for backend reliability

## Installation Guide

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- MongoDB (local or Atlas)
- Google OAuth Client ID (for Google sign-in)

### Frontend Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/auth-page.git
   cd auth-page
   ```

2. **Install frontend dependencies**:

   ```bash
   npm install
   ```

3. **Configure Google OAuth for Development**:

   - Create a project in the [Google Cloud Console](https://console.cloud.google.com/)
   - Enable the Google People API and Google+ API
   - Create OAuth 2.0 Client IDs in "APIs & Services" > "Credentials"
   - Configure authorized JavaScript origins (e.g., `http://localhost:5173`)
   - Create a `.env` file in the project root with:
     ```env
     VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
     VITE_REDIRECT_URI=http://localhost:5173
     ```

4. **Start the frontend development server**:

   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

### Backend Setup Instructions

1. **Navigate to the server directory**:

   ```bash
   cd server
   ```

2. **Install backend dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**:

   - Create a `.env` file based on `.env.example`:
     ```bash
     cp .env.example .env
     ```
   - Update with your MongoDB URI, JWT secret, and other configurations

4. **Start the backend development server**:
   ```bash
   npm run dev
   ```

## Usage Guide

### Authentication Flow

1. **User Registration**: Create a new account by:

   - Providing name, email, and password (minimum 8 characters)
   - Using the "Sign in with Google" button for quick registration

2. **User Login**: Access your account by:

   - Entering email and password
   - Using the "Sign in with Google" option

3. **Google Sign-In**: Sign in directly with your Google account for fast authentication

### Code Examples

#### Protected Route Implementation

```tsx
// src/utils/ProtectedRoute.tsx
import React from "react";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login
    window.location.pathname = "/login";
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
```

#### Authentication Context Usage

```tsx
// Example of using the auth context in a component
import React from "react";
import { useAuth } from "../context/AuthContext";

const ProfileComponent: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h2>Welcome, {user?.name}</h2>
      <p>Email: {user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

## API Documentation

### Authentication Endpoints

#### Register User

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Body**: `{ name, email, password }`
- **Response**: `{ user, token }`

#### Login User

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**: `{ email, password }`
- **Response**: `{ user, token }`

#### Forgot Password

- **URL**: `/api/auth/forgot-password`
- **Method**: `POST`
- **Body**: `{ email }`
- **Response**: `{ message }`

#### Reset Password

- **URL**: `/api/auth/reset-password`
- **Method**: `POST`
- **Body**: `{ token, password }`
- **Response**: `{ message }`

### User Endpoints

#### Get User Profile

- **URL**: `/api/users/profile`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: `{ user }`

## Testing

The project includes comprehensive tests for both frontend and backend components.

### Frontend Tests

Run frontend tests with:

```bash
npm test
```

For test coverage:

```bash
npm run test:coverage
```

### Backend Tests

Navigate to the server directory and run:

```bash
cd server
npm test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write tests for new features
- Update documentation as needed
- Make sure all tests pass before submitting a PR

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you have any questions or need help with the Authentication Page project, please open an issue on GitHub or contact the maintainers directly.

---

Built with ❤️ during my Internship at TechnoHacks EduTech Official
