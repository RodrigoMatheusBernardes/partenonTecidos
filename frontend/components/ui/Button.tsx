'use client';

import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'text';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
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
  const baseStyles = `
    flex items-center justify-center gap-2.5
    rounded-xl font-medium tracking-wide
    transition-all duration-300 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-[#0B1F33] focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantStyles = {
    primary: `
      bg-metallic-navy text-white border border-transparent
      hover:bg-metallic-navy-hover hover:shadow-lg
      active:scale-[0.97]
    `,
    secondary: `
      bg-transparent text-metallic-navy border-2 border-[#0B1F33]
      hover:bg-metallic-navy hover:text-white
      active:scale-[0.97]
    `,
    ghost: `
      bg-transparent text-[#1a1a1a] border border-transparent
      hover:bg-[#f5f2ee]
    `,
    text: `
      bg-transparent text-metallic-navy border border-transparent
      hover:underline hover:text-[#0B1F33]
    `,
  };

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

  if (href) {
    return <Link href={href} className={combinedClass}>{children}</Link>;
  }

  return <button className={combinedClass} disabled={disabled} {...props}>{children}</button>;
}