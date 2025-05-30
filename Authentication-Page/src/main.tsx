import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.tsx';
import './index.css';

// Replace with your actual Google Client ID
const googleClientId = '123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com';

// Use StrictMode only in development
const AppWrapper = import.meta.env.DEV ? 
  ({ children }: { children: React.ReactNode }) => <StrictMode>{children}</StrictMode> :
  ({ children }: { children: React.ReactNode }) => <>{children}</>;

// Create root with error handling
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

// Render with performance optimization
root.render(
  <AppWrapper>
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  </AppWrapper>
);
