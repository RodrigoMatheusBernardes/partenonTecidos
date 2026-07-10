'use client';

import React from 'react';

type CardVariant = 'default' | 'bordered' | 'glass';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

const variantStyles = {
  default: 'bg-white',
  bordered: 'bg-white border border-gray-mid',
  glass: 'bg-white/80 backdrop-blur-sm border border-white/20',
};

export default function Card({
  children,
  variant = 'default',
  className = '',
  hoverable = false,
  onClick,
}: CardProps) {
  return (
    <div
      className={`
        rounded-card overflow-hidden
        ${variantStyles[variant]}
        ${hoverable ? 'transition-all duration-300 hover:shadow-lg-luxury hover:transform hover:-translate-y-1 cursor-pointer' : 'shadow-sm-luxury'}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {children}
    </div>
  );
}
