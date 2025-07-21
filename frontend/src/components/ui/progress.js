import React from 'react';

export const Progress = ({
  className = '',
  value = 0,
  max = 100,
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div
      className={`relative h-4 w-full overflow-hidden rounded-full bg-secondary ${className}`}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-primary transition-all duration-300 ease-in-out"
        style={{
          transform: `translateX(-${100 - percentage}%)`,
        }}
      />
    </div>
  );
}; 