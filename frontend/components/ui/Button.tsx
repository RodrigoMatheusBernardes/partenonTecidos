'use client';

import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-dark-light text-white
    border-2 border-dark-light
    hover:bg-gold hover:text-dark-light hover:border-gold
    active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed
    disabled:hover:bg-dark-light disabled:hover:text-white disabled:hover:border-dark-light
  `,
  secondary: `
    bg-white text-dark-light
    border-2 border-dark-light
    hover:bg-light hover:border-gold
    active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed
    disabled:hover:bg-white disabled:hover:border-dark-light
  `,
  tertiary: `
    bg-transparent text-dark-light
    border-2 border-gray-mid
    hover:bg-light hover:border-dark-light
    active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed
    disabled:hover:bg-transparent disabled:hover:border-gray-mid
  `,
  danger: `
    bg-error text-white
    border-2 border-error
    hover:bg-red-600 hover:border-red-600
    active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed
    disabled:hover:bg-error disabled:hover:border-error
  `,
  ghost: `
    bg-transparent text-dark-light
    border-2 border-transparent
    hover:text-gold
    active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs font-semibold uppercase tracking-wide',
  md: 'px-6 py-2.5 text-sm font-semibold uppercase tracking-wide',
  lg: 'px-8 py-3.5 text-base font-bold uppercase tracking-wider',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          inline-flex items-center justify-center gap-2
          rounded-button
          transition-all duration-300 ease-out
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Carregando...
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && <span>{icon}</span>}
            <span>{children}</span>
            {icon && iconPosition === 'right' && <span>{icon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
