'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const variantStyles = {
  primary: 'bg-dark-light text-white hover:bg-gold hover:text-dark-light border border-dark-light hover:border-gold transition-all duration-300',
  secondary: 'bg-light text-dark-light hover:bg-dark-light hover:text-white border border-dark-light transition-all duration-300',
  outline: 'bg-transparent text-dark-light border border-dark-light hover:bg-dark-light hover:text-white transition-all duration-300',
  ghost: 'bg-transparent text-dark-light hover:text-gold transition-colors duration-300',
  danger: 'bg-error text-white hover:bg-red-700 transition-all duration-300',
};

const sizeStyles = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-base',
  lg: 'px-6 py-3 text-base font-medium',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={isLoading || disabled}
      className={`
        inline-flex items-center justify-center gap-2 font-medium
        rounded-button transition-all duration-300 ease-out
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Carregando...
        </>
      ) : (
        <>
          {icon && <span className="flex items-center justify-center">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
