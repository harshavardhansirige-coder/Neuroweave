import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'glass' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyle = "relative inline-flex items-center justify-center font-outfit font-semibold rounded-xl transition-all duration-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none";
  
  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-7 py-3 text-lg"
  };

  const variantStyles = {
    primary: "bg-primary text-white hover:bg-primary-dark shadow-neon hover:shadow-[0_0_20px_rgba(139,92,246,0.65)]",
    secondary: "bg-secondary text-white hover:bg-secondary-dark shadow-neon-secondary hover:shadow-[0_0_20px_rgba(14,165,233,0.65)]",
    accent: "bg-accent text-white hover:bg-accent-dark hover:shadow-[0_0_20px_rgba(236,72,153,0.65)]",
    glass: "glass-panel text-white hover:bg-white/10 hover:border-white/20",
    ghost: "text-zinc-400 hover:text-white hover:bg-white/5",
    danger: "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      disabled={disabled || isLoading}
      className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...(props as any)}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2.5 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : children}
    </motion.button>
  );
};
