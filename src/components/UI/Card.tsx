import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  glow = false,
  ...props
}) => {
  return (
    <div
      className={`rounded-2xl border border-white/5 bg-slate-950/45 backdrop-blur-xl ${
        hoverEffect 
          ? 'hover:bg-slate-900/55 hover:border-primary/20 transition-all duration-300 hover:-translate-y-0.5 shadow-glass-hover' 
          : 'shadow-glass'
      } ${
        glow ? 'shadow-neon border-primary/20' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
export default Card;
