import React from 'react';
import { cn } from '../../lib/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, hover = false, children, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-slate-100 shadow-sm p-6',
        hover && 'transition-all duration-200 hover:shadow-md hover:border-emerald-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
