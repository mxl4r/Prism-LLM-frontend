import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ icon, className = '', ...props }) => {
  return (
    <div className="relative w-full">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>
      )}
      <input
        className={`
          w-full 
          bg-white/50 
          backdrop-blur-sm 
          border border-slate-200 
          rounded-xl 
          py-2.5 
          ${icon ? 'pl-10' : 'pl-4'} 
          pr-4 
          text-slate-700 
          placeholder-slate-400 
          focus:outline-none 
          focus:ring-2 
          focus:ring-prism-accent/10 
          focus:border-prism-accent/30 
          transition-all 
          duration-200
          ${className}
        `}
        {...props}
      />
    </div>
  );
};