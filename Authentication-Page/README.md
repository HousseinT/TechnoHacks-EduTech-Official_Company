# Authentication Page: Secure User Authentication System with React, Node.js, and Google OAuth

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Overview

Auth Page is a modern, secure, and SEO-friendly user authentication system designed for web applications. Built with a robust tech stack including React, TypeScript, and Node.js, it offers comprehensive user management features such as secure registration, JWT-based login, password recovery, and protected routes. A key highlight is its seamless Google OAuth integration, providing a convenient one-click sign-in experience. The project boasts a clean, responsive UI with a beautiful gradient background and a modern design aesthetic, ensuring an excellent user experience across all devices.

## Key Features

- **User Registration**: Secure sign-up with email validation and strong password requirements, enhancing user data security.
- **User Authentication**: Robust JWT-based authentication for secure user sessions and access control.
- **Google OAuth Integration**: Streamlined one-click sign-in using Google accounts, improving user convenience and reducing friction.
- **Password Recovery**: Efficient forgot password functionality with email-based reset links, ensuring account accessibility.
- **Protected Routes**: Implement secure routing to restrict access to authenticated users, safeguarding sensitive content.
- **Responsive Design**: Mobile-first approach with a clean, modern UI, providing an optimal experience on any device.
- **Form Validation**: Comprehensive client-side validation for all forms, ensuring data integrity and user feedback.
- **Error Handling**: Advanced error handling mechanisms with clear user feedback, improving application reliability.
- **Testing**: Extensive test coverage using Jest and React Testing Library, guaranteeing code quality and stability.

## Tech Stack

### Frontend Technologies
- React 18: A powerful JavaScript library for building dynamic user interfaces.
- TypeScript: Adds static typing to JavaScript, enhancing code quality and maintainability.
- React Router v7: For declarative routing within the single-page application.
- TailwindCSS: A utility-first CSS framework for rapid and responsive UI development.
- Lucide React: A collection of beautiful and customizable open-source icons.
- @react-oauth/google: Facilitates easy integration of Google Authentication into React applications.
- Jest and React Testing Library: Comprehensive tools for robust frontend testing.
- Vite: A next-generation frontend tooling for fast development and optimized builds.

### Backend Technologies
- Node.js with Express: A fast, unopinionated, minimalist web framework for Node.js.
- MongoDB with Mongoose ODM: A NoSQL database and an elegant MongoDB object modeling for Node.js.
- JWT (JSON Web Tokens): For secure and stateless authentication.
- bcrypt: A library to hash passwords securely.
- Express Validator: Middleware for validating and sanitizing request data.
- Nodemailer: A module for Node.js applications to allow easy email sending.
- Jest: For reliable backend testing and ensuring API integrity.

## Installation Guide

### Prerequisites

- Node.js (v16 or higher): Essential for running both frontend and backend.
- npm or yarn: Package managers for installing project dependencies.
- MongoDB (local or Atlas): Database solution for storing user data.
- Google OAuth Client ID: Required for enabling Google sign-in functionality.

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
   - Create a new project in the [Google Cloud Console](https://console.cloud.google.com/).
   - Enable the Google People API and Google+ API (if required for specific scopes).
   - Navigate to "APIs & Services" > "Credentials" and create OAuth 2.0 Client IDs.
   - Select "Web application" and configure authorized JavaScript origins (e.g., `http://localhost:5173`) and authorized redirect URIs.
   - Create a `.env` file in the project root (`auth-page/.env`) and add your Google Client ID and Redirect URI:
     ```env
     VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
     VITE_REDIRECT_URI=http://localhost:5173
     ```

4. **Start the frontend development server**:
   ```bash
   npm run dev
   ```

5. **Build the frontend for production**:
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

3. **Create and configure environment variables**:
   - Create a `.env` file in the `server` directory based on `.env.example`:
     ```bash
     cp .env.example .env
     ```
   - Update the `.env` file with your MongoDB URI, JWT secret, and other necessary configurations for your backend services.

4. **Start the backend development server**:
   ```bash
   npm run dev
   ```

## Usage Guide

### Authentication Flow Overview

1. **User Registration**: Users can create a new account securely by either:
   - Providing their name, email, and a strong, unique password (minimum 8 characters).
   - Utilizing the convenient "Sign in with Google" button for quick and seamless registration.


2. **User Login**: Registered users can access their accounts by:
   - Entering their email and password.
   - Using the "Sign in with Google" option for direct access.

3. **Google Sign-In**: Users can sign in directly using their Google account, providing a fast and secure authentication method.


### Code Examples

#### Protected Route Implementation

```tsx
// src/utils/ProtectedRoute.tsx
import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    // Redirect to login
    window.location.pathname = '/login';
    return null;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
```

#### Authentication Context Usage

```tsx
// Example of using the auth context in a component
import React from 'react';
import { useAuth } from '../context/AuthContext';

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

If you have any questions or need help with the Auth Page project, please open an issue on GitHub or contact the maintainers directly.

---

Built with ❤️ by Houssein Taleb