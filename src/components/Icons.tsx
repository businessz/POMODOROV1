import React from 'react';

interface IconProps {
  className?: string;
}

export function Tomato({ className = '' }: IconProps) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" />
    </svg>
  );
}