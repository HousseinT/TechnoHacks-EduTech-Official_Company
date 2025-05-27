import React from 'react';

interface LinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

export const Link: React.FC<LinkProps> = ({ to, children, className = '' }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState({}, '', to);
    
    // Dispatch a custom event to notify about path change
    window.dispatchEvent(new CustomEvent('pathChanged'));
  };

  return (
    <a 
      href={to} 
      onClick={handleClick}
      className={`transition duration-200 ${className}`}
    >
      {children}
    </a>
  );
};