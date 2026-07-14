'use client';

import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'text';
  size?: 'sm' | 'md' | 'lg';
  href?: string; // Para usar como Link
  className?: string;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  // Base Styles (compartilhados por todos)
  const baseStyles = `
    flex items-center justify-center gap-2.5
    rounded-xl font-medium tracking-wide
    transition-all duration-300 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-[#C5A880] focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  // Variant Styles
  const variantStyles = {
    primary: `
      bg-[#0B0C10] text-white border border-transparent
      hover:bg-[#C5A880] hover:text-[#0B0C10]
      active:scale-[0.97]
    `,
    secondary: `
      bg-transparent text-[#C5A880] border border-[#C5A880]
      hover:bg-[#C5A880] hover:text-[#0B0C10]
      active:scale-[0.97]
    `,
    ghost: `
      bg-transparent text-[#1a1a1a] border border-transparent
      hover:bg-[#f5f2ee]
    `,
    text: `
      bg-transparent text-[#C5A880] border border-transparent
      hover:underline
    `,
  };

  // Size Styles
  const sizeStyles = {
    sm: 'py-1.5 px-3 text-xs',
    md: 'py-2.5 px-5 text-sm',
    lg: 'py-3.5 px-8 text-base',
  };

  const combinedClass = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${className}
  `;

  // Se tiver href, renderiza como Link
  if (href) {
    return (
      <Link href={href} className={combinedClass}>
        {children}
      </Link>
    );
  }

  // Caso contrário, renderiza como botão
  return (
    <button className={combinedClass} disabled={disabled} {...props}>
      {children}
    </button>
  );
}