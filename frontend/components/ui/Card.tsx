'use client';

import React from 'react';

type CardVariant = 'default' | 'interactive' | 'flat' | 'elevated';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hoverable?: boolean;
  children: React.ReactNode;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-white border border-gray-mid shadow-sm-luxury',
  interactive: 'bg-white border-2 border-gray-mid shadow-sm-luxury hover:shadow-md-luxury hover:border-gold transition-all duration-300 cursor-pointer',
  flat: 'bg-light border border-gray-mid',
  elevated: 'bg-white border border-gray-mid shadow-lg-luxury',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      hoverable = false,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`
          rounded-card overflow-hidden
          ${variantStyles[variant]}
          ${hoverable && variant !== 'interactive' ? 'hover:shadow-md-luxury transition-shadow duration-300 cursor-pointer' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  (
    {
      title,
      subtitle,
      icon,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`px-6 py-5 border-b border-gray-mid ${className}`}
        {...props}
      >
        {children || (
          <div>
            {(title || icon) && (
              <div className="flex items-center gap-3 mb-1">
                {icon && <span className="flex-shrink-0">{icon}</span>}
                {title && (
                  <h3 className="font-serif font-semibold text-lg text-dark-light">
                    {title}
                  </h3>
                )}
              </div>
            )}
            {subtitle && (
              <p className="text-sm text-text-secondary font-light">{subtitle}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  (
    {
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`px-6 py-5 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  (
    {
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`px-6 py-4 border-t border-gray-mid bg-light/30 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';
