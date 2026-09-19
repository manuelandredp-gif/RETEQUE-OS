import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'whatsapp' | 'warning' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const variants = {
    primary: 'bg-brand-red hover:bg-brand-red-dark text-white rounded-xl shadow-sm hover:shadow-md',
    secondary: 'bg-white hover:bg-neutral-50 text-text-main border border-line rounded-xl hover:border-neutral-300',
    whatsapp: 'bg-whatsapp hover:bg-whatsapp-hover text-white rounded-xl shadow-sm hover:shadow-md font-semibold',
    warning: 'bg-brand-yellow hover:bg-[#E5981B] text-neutral-900 rounded-full font-bold shadow-sm',
    icon: 'bg-brand-red hover:bg-brand-red-dark text-white rounded-lg p-2 aspect-square',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${variant !== 'icon' ? sizes[size] : ''} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
