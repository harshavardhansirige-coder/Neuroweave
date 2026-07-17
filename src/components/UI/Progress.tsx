import React from 'react';

interface ProgressProps {
  value: number; // 0 to 100
  className?: string;
  glow?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({ value, className = '', glow = true }) => {
  const percent = Math.min(Math.max(value, 0), 100);

  return (
    <div className={`h-2.5 w-full rounded-full bg-white/5 overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-500 ease-out ${
          glow ? 'shadow-[0_0_10px_rgba(139,92,246,0.6)]' : ''
        }`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};
export default Progress;
