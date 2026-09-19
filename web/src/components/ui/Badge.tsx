import React from 'react';
import { Percent } from 'lucide-react';

interface BadgeProps {
  variant?: 'promo' | 'nuevo' | 'categoria';
  children?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'promo',
  children,
  className = '',
}) => {
  if (variant === 'promo') {
    return (
      <span className={`inline-flex items-center gap-1 bg-[#FDE8CC] text-[#D31728] text-[11px] font-bold px-2 py-0.5 rounded-full ${className}`}>
        <Percent className="w-3 h-3 stroke-[3]" />
        <span>{children || 'Promo'}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-red-light text-brand-red ${className}`}>
      {children}
    </span>
  );
};
