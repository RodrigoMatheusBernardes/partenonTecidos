'use client';

import React from 'react';

type InputType = 'text' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'url';
type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  type?: InputType;
  inputSize?: InputSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  error?: string;
  label?: string;
  helper?: string;
}

const sizeStyles: Record<InputSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-base',
  lg: 'px-5 py-3.5 text-lg',
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      inputSize = 'md',
      icon,
      iconPosition = 'left',
      error,
      label,
      helper,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-dark-light mb-2">
            {label}
          </label>
        )}
        
        <div className="relative flex items-center">
          {icon && iconPosition === 'left' && (
            <span className="absolute left-3 text-text-secondary flex items-center justify-center">
              {icon}
            </span>
          )}
          
          <input
            ref={ref}
            type={type}
            disabled={disabled}
            className={`
              w-full
              border-2
              rounded-button
              transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold
              disabled:bg-light disabled:cursor-not-allowed disabled:opacity-60
              ${icon && iconPosition === 'left' ? 'pl-10' : ''}
              ${icon && iconPosition === 'right' ? 'pr-10' : ''}
              ${error
                ? 'border-error focus:border-error'
                : 'border-gray-mid focus:border-dark-light'
              }
              ${sizeStyles[inputSize]}
              ${className}
            `}
            {...props}
          />
          
          {icon && iconPosition === 'right' && (
            <span className="absolute right-3 text-text-secondary flex items-center justify-center">
              {icon}
            </span>
          )}
        </div>
        
        {error && (
          <p className="text-error text-xs font-medium mt-1">{error}</p>
        )}
        
        {helper && !error && (
          <p className="text-text-secondary text-xs font-light mt-1">{helper}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
