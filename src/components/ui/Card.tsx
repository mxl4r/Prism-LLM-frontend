'use client';
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', noPadding = false }) => {
  return (
    <div className={`
      bg-prism-glass 
      backdrop-blur-xl 
      border border-prism-glassBorder 
      shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] 
      rounded-3xl 
      ${noPadding ? '' : 'p-6'} 
      ${className}
    `}>
      {children}
    </div>
  );
};