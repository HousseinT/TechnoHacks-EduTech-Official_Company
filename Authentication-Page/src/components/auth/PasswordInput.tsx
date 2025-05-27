import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Input from '../common/Input';

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  value,
  onChange,
  error,
  placeholder = '••••••••',
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        label={label}
        value={value}
        onChange={onChange}
        error={error}
        placeholder={placeholder}
        required={required}
      />
      <button
        type="button"
        className="absolute right-4 top-9 text-gray-400 hover:text-primary-600 focus:outline-none transition-colors duration-200"
        onClick={togglePasswordVisibility}
        tabIndex={-1}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? (
          <Eye size={18} className="transition-transform duration-200 hover:scale-110" />
        ) : (
          <EyeOff size={18} className="transition-transform duration-200 hover:scale-110" />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;