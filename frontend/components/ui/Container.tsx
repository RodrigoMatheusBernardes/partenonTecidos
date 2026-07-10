'use client';

import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  fullHeight?: boolean;
}

export default function Container({
  children,
  className = '',
  fullHeight = false,
}: ContainerProps) {
  return (
    <div
      className={`
        w-full max-w-[1440px] mx-auto
        px-[clamp(1rem, 4vw, 2rem)]
        ${fullHeight ? 'min-h-screen' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
