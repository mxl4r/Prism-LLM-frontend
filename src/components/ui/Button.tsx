'use client';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  size = 'md',
  active = false,
  ...props 
}) => {
  
  const baseStyles = "relative overflow-hidden transition-all duration-300 ease-out font-medium rounded-2xl flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-prism-accent/20 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-prism-accent text-white hover:bg-prism-accent/90 shadow-lg hover:shadow-prism-accent/20",
    secondary: `bg-prism-glass backdrop-blur-md border border-prism-glassBorder text-prism-accent hover:bg-white/80 shadow-sm ${active ? 'ring-2 ring-prism-accent/20 bg-white' : ''}`,
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100/50 hover:text-prism-accent",
    icon: "bg-transparent text-slate-500 hover:text-prism-accent hover:bg-slate-100/50 rounded-full",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const iconSizes = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-3",
  };

  const appliedSize = variant === 'icon' ? iconSizes[size] : sizes[size];

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${appliedSize} ${className}`}
      {...props}
    >
      {variant === 'primary' && (
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite]" />
      )}
      {children}
    </button>
  );
};