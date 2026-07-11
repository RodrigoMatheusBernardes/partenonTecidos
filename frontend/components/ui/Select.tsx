'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

type SelectSize = 'sm' | 'md' | 'lg';

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  selectSize?: SelectSize;
  icon?: React.ReactNode;
  error?: string;
  label?: string;
  helper?: string;
  options?: Array<{ value: string; label: string; disabled?: boolean }>;
}

const sizeStyles: Record<SelectSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-base',
  lg: 'px-5 py-3.5 text-lg',
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      selectSize = 'md',
      icon,
      error,
      label,
      helper,
      options = [],
      className = '',
      disabled,
      children,
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
        
        <div className="relative">
          <select
            ref={ref}
            disabled={disabled}
            className={`
              w-full
              appearance-none
              border-2
              rounded-button
              bg-white
              transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold
              disabled:bg-light disabled:cursor-not-allowed disabled:opacity-60
              pr-10
              ${error ? 'border-error' : 'border-gray-mid focus:border-dark-light'}
              ${sizeStyles[selectSize]}
              ${className}
            `}
            {...props}
          >
            {children}
            {options.length > 0 && options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none" />
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

Select.displayName = 'Select';
